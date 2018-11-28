package com.aotain.datamanagerweb.utils.thread;

import com.aotain.cu.serviceapi.dto.*;
import com.aotain.cu.serviceapi.model.BaseModel;
import com.aotain.cu.serviceapi.model.ImportTaskModel;
import com.aotain.cu.serviceapi.model.ServiceDomainInformation;
import com.aotain.datamanagerweb.constant.ImportConstant;
import com.aotain.datamanagerweb.mapper.task.ImportTaskMapper;
import com.aotain.datamanagerweb.serviceapi.PreUserRackApi;
import com.aotain.datamanagerweb.utils.ExcelUtil;
import com.aotain.datamanagerweb.utils.SpringUtil;
import com.aotain.datamanagerweb.utils.dataimport.ImportErrorData;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.text.NumberFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;


public class HandleUserFileThread extends Thread {

    private Logger logger = LoggerFactory.getLogger(HandleUserFileThread.class);

    private String fileName;
    private String childDir;
    private Long taskId;
    private ImportTaskModel importTaskModel;

    private List<ImportErrorData> userErrorDatas = null;
    private List<ImportErrorData> userServiceErrorDatas =null;
    private List<ImportErrorData> userBandErrorDatas = null;
    private List<ImportErrorData> userVirErrorDatas = null;
    private Map<String,Object> registerIdMap =new HashMap<>();
    //多少批请求处理
    private static long BANCH_NUM=1000;

    public HandleUserFileThread(String fileName, String childDir, Long taskId, ImportTaskModel model) {
        super();
        this.fileName = fileName;
        this.childDir = childDir;
        this.taskId = taskId;
        this.importTaskModel = model;
        userErrorDatas = new ArrayList<ImportErrorData>();
        userServiceErrorDatas = new ArrayList<ImportErrorData>();
        userBandErrorDatas = new ArrayList<ImportErrorData>();
        userVirErrorDatas = new ArrayList<ImportErrorData>();
    }

    public void run() {
        File dataFile = getFile();
        ImportTaskMapper mapper = getImportTaskMapper();
        ThreadContext context = getThreadContext();
        try {
            //  sheet		 rowNum		content  : 表 行  内容
            Map<Integer, Map<Integer, String[]>> map = ExcelUtil.readExcelFromStream(new FileInputStream(dataFile));
            if (map != null && !map.isEmpty()) {
                Map<Integer, String[]> userInfoMap = map.get(0);
                Map<Integer, String[]> userServiceMap = map.get(1);
                Map<Integer, String[]> userBandMap = map.get(2);
                Map<Integer, String[]> userVirMap = map.get(3);
                Map<Integer, UserInformationDTO> userInformations = constructUserInfo(userInfoMap);
                Map<Integer, UserServiceInformationDTO> userServiceInformations = constructUserServiceInfo(userServiceMap);
                Map<Integer, UserBandwidthInformationDTO> userBandInformations = constructUserBandInfo(userBandMap);
                Map<Integer, UserVirtualInformationDTO> userVirInformations = constructUserVirInfo(userVirMap);

                long totalNum = Long.valueOf(userInformations.size() + userServiceInformations.size() + userBandInformations.size() + userVirInformations.size());
                AtomicInteger handleNum = new AtomicInteger(0);
                AtomicInteger banchNum = new AtomicInteger(0);
                PreUserRackApi preUserRackApi = getPreUserRackApi();
                AtomicInteger finish = new AtomicInteger(0);
                if (userInformations.size() > 0) {
                    Map<Integer, UserInformationDTO> importMap = new HashMap<>();
                    userInformations.forEach((key,value)->{
                        prepareImport(value,importTaskModel);
                        banchNum.addAndGet(1);
                        handleNum.addAndGet(1);
                        importMap.put(key,value);
                        //等于批处理数量或者等于map大小
                        if (banchNum.intValue()==BANCH_NUM || handleNum.intValue()==userInformations.size()){
                            try {
                                Map<Integer,ResultDto> resultDtoMap = preUserRackApi.importUser(importMap);
                                if (resultDtoMap!=null){
                                    resultDtoMap.forEach((k,result)->{
                                        try {
                                            if (result.getResultCode() == ResultDto.ResultCodeEnum.ERROR.getCode().intValue()) {
                                                if (result.getAjaxValidationResult()!=null){
                                                    userErrorDatas.add(new ImportErrorData(0, k, userInfoMap.get(k), (result.getAjaxValidationResult().getErrorsToString()).replace("[","").replace("]","")));
                                                }else if (!StringUtils.isEmpty(result.getResultMsg())){
                                                    userErrorDatas.add(new ImportErrorData(0, k, userInfoMap.get(k), result.getResultMsg().replace("[","").replace("]","")));
                                                }
                                            }
                                        }catch (Exception e){
                                            logger.error("",e);
                                            userErrorDatas.add(new ImportErrorData(0, k, userInfoMap.get(k), "连接异常，请核查是否导入"));
                                        }
                                    });
                                }
                            }catch (Exception e){
                                logger.error("",e);
                                importMap.forEach((k, v) ->{
                                    userErrorDatas.add(new ImportErrorData(0, k, userInfoMap.get(k), "网络异常，重试"));
                                });
                            }
                            setPrecent(handleNum.intValue(), totalNum, context);
                            importMap.clear();
                            banchNum.set(0);
                            try {
                                sleep(200l);
                            } catch (InterruptedException e) {
                                logger.error("sleep error",e);
                            }
                        }
                    });
                }
                finish.set(userInformations.size());
                if (userServiceInformations.size() > 0) {
                    banchNum.set(0);
                    handleNum.set(0);
                    Map<Integer, UserServiceInformationDTO> importMap = new HashMap<>();
                    userServiceInformations.forEach((key, value) -> {
                        prepareImport(value,importTaskModel);
                        banchNum.addAndGet(1);
                        handleNum.addAndGet(1);
                        importMap.put(key,value);
                        //等于批处理数量或者等于map大小
                        if (banchNum.intValue()==BANCH_NUM || handleNum.intValue()==userServiceInformations.size()){
                            try {
                                Map<Integer,ResultDto> resultDtoMap = preUserRackApi.importUserService(importMap);
                                if (resultDtoMap!=null){
                                    resultDtoMap.forEach((k,result)->{
                                        try {
                                            if (result.getResultCode() == ResultDto.ResultCodeEnum.ERROR.getCode().intValue()) {
                                                if (result.getAjaxValidationResultMap() != null && result.getAjaxValidationResultMap().get("0") != null) {
                                                    userServiceErrorDatas.add(new ImportErrorData(1, k, userServiceMap.get(k), result.getAjaxValidationResultMap().get("0").getErrorsToString().replace("[", "").replace("]", "")));
                                                } else if (result.getResultMsg() != null) {
                                                    userServiceErrorDatas.add(new ImportErrorData(1, k, userServiceMap.get(k), result.getResultMsg().replace("[", "").replace("]", "")));
                                                }
                                            }
                                        }catch (Exception e){
                                            logger.error("",e);
                                            userServiceErrorDatas.add(new ImportErrorData(1, k, userServiceMap.get(k), "连接异常，请核查是否导入"));
                                        }
                                    });
                                }
                            }catch (Exception e){
                                logger.error("",e);
                                importMap.forEach((k, v) ->{
                                    userServiceErrorDatas.add(new ImportErrorData(0, k, userServiceMap.get(k), "网络异常，重试"));
                                });
                            }
                            setPrecent(finish.intValue()+handleNum.intValue(), totalNum, context);
                            importMap.clear();
                            banchNum.set(0);
                            try {
                                sleep(200l);
                            } catch (InterruptedException e) {
                                logger.error("sleep error",e);
                            }
                        }
                    });
                }

                finish.addAndGet(userServiceInformations.size());
                if (userBandInformations.size() > 0) {
                    banchNum.set(0);
                    handleNum.set(0);
                    Map<Integer, UserBandwidthInformationDTO> importMap = new HashMap<>();
                    userBandInformations.forEach((key, value) -> {
                        prepareImport(value,importTaskModel);
                        banchNum.addAndGet(1);
                        handleNum.addAndGet(1);
                        importMap.put(key,value);
                        //等于批处理数量或者等于map大小
                        if (banchNum.intValue()==BANCH_NUM || handleNum.intValue()==userBandInformations.size()){
                            try {
                                Map<Integer,ResultDto> resultDtoMap = preUserRackApi.importUserBand(importMap);
                                if (resultDtoMap!=null){
                                    resultDtoMap.forEach((k,result)->{
                                        try {
                                            if (result.getResultCode() == ResultDto.ResultCodeEnum.ERROR.getCode().intValue()) {
                                                if (result.getAjaxValidationResultMap()!=null && result.getAjaxValidationResultMap().get("0") != null) {
                                                    userBandErrorDatas.add(new ImportErrorData(1, k, userBandMap.get(k), (result.getAjaxValidationResultMap().get("0").getErrorsToString()).replace("[","").replace("]","")));
                                                }else if (result.getResultMsg() != null){
                                                    userBandErrorDatas.add(new ImportErrorData(1, k, userBandMap.get(k), result.getResultMsg().replace("[","").replace("]","")));
                                                }
                                            }
                                        }catch (Exception e){
                                            logger.error("",e);
                                            userBandErrorDatas.add(new ImportErrorData(0, k, userBandMap.get(k), "连接异常，请核查是否导入"));
                                        }
                                    });
                                }
                            }catch (Exception e){
                                logger.error("",e);
                                importMap.forEach((k, v) ->{
                                    userBandErrorDatas.add(new ImportErrorData(0, k, userBandMap.get(k), "网络异常，重试"));
                                });
                            }
                            setPrecent(finish.intValue()+handleNum.intValue(), totalNum, context);
                            importMap.clear();
                            banchNum.set(0);
                            try {
                                sleep(200l);
                            } catch (InterruptedException e) {
                                logger.error("sleep error",e);
                            }
                        }
                    });
                }
                finish.addAndGet(userBandInformations.size());
                if (userVirInformations.size() > 0) {
                    banchNum.set(0);
                    handleNum.set(0);
                    Map<Integer, UserVirtualInformationDTO> importMap = new HashMap<>();
                    userVirInformations.forEach((key, value) -> {
                        prepareImport(value,importTaskModel);
                        banchNum.addAndGet(1);
                        handleNum.addAndGet(1);
                        importMap.put(key,value);
                        //等于批处理数量或者等于map大小
                        if (banchNum.intValue()==BANCH_NUM || handleNum.intValue()==userVirInformations.size()){
                            try {
                                Map<Integer,ResultDto> resultDtoMap = preUserRackApi.importUserVir(importMap);
                                if (resultDtoMap!=null){
                                    resultDtoMap.forEach((k,result)->{
                                        try {
                                            if (result.getResultCode() == ResultDto.ResultCodeEnum.ERROR.getCode().intValue()) {
                                                if (result.getAjaxValidationResultMap()!=null && result.getAjaxValidationResultMap().get("0") != null) {
//                                                userBandErrorDatas.add(new ImportErrorData(1, k, userBandMap.get(k), (result.getAjaxValidationResultMap().get("0").getErrorsToString()).replace("[","").replace("]","")));
                                                    userVirErrorDatas.add(new ImportErrorData(1, k, userVirMap.get(k), (result.getAjaxValidationResultMap().get("0").getErrorsToString()).replace("[","").replace("]","")));
                                                }else if (result.getResultMsg() != null) {
                                                    userVirErrorDatas.add(new ImportErrorData(1, k, userVirMap.get(k), result.getResultMsg().replace("[","").replace("]","")));
                                                }
                                            }
                                        }catch (Exception e){
                                            logger.error("",e);
                                            userVirErrorDatas.add(new ImportErrorData(0, k, userVirMap.get(k), "连接异常，请核查是否导入"));
                                        }
                                    });
                                }
                            }catch (Exception e){
                                logger.error("",e);
                                importMap.forEach((k, v) ->{
                                    userVirErrorDatas.add(new ImportErrorData(0, k, userVirMap.get(k), "网络异常，重试"));
                                });
                            }
                            setPrecent(finish.intValue()+handleNum.intValue(), totalNum, context);
                            importMap.clear();
                            banchNum.set(0);
                            try {
                                sleep(200l);
                            } catch (InterruptedException e) {
                                logger.error("sleep error",e);
                            }
                        }
                    });
                }

                //导入已经完成,接下来更新数据库和生成错误文件
                if (userErrorDatas.isEmpty() && userServiceErrorDatas.isEmpty() &&
                        userBandErrorDatas.isEmpty() && userVirErrorDatas.isEmpty()) {
                    context.set("status", "done");
                    ImportTaskModel model = new ImportTaskModel();
                    model.setErrorFileName("");
                    model.setStatus(ImportConstant.StatusEum.IMPORT_SUCCESS.getType());
                    model.setTaskId(taskId);
                    mapper.update(model);
                } else {
                    Map<String, List<ImportErrorData>> dataMap = new HashMap<>();
                    dataMap.put("用户主体信息", userErrorDatas);
                    dataMap.put("服务信息", userServiceErrorDatas);
                    dataMap.put("带宽信息", userBandErrorDatas);
                    dataMap.put("虚拟主机", userVirErrorDatas);
                    String errorFile = fileName.substring(0, fileName.lastIndexOf(".")) + "_error";
                    ExcelUtil.createExcelWithTemplate(dataMap, "user", "userInformationTemplate", errorFile, "xlsx");

                    ImportTaskModel model = new ImportTaskModel();
                    model.setErrorFileName(errorFile);
                    model.setStatus(ImportConstant.StatusEum.IMPORT_SUCCESS.getType());
                    model.setTaskId(taskId);
                    mapper.update(model);
                }
                setPrecent(1, 1, context);
            } else {
                context.set("status", "undone");
                ImportTaskModel model = new ImportTaskModel();
                model.setStatus(ImportConstant.StatusEum.IMPORT_FAIL.getType());
                model.setTaskId(taskId);
                mapper.update(model);
            }
        } catch (Exception e) {
            logger.error("read data from excel error", e);
            context.set("status", "undone");
            ImportTaskModel model = new ImportTaskModel();
            model.setStatus(ImportConstant.StatusEum.IMPORT_FAIL.getType());
            model.setTaskId(taskId);
            mapper.update(model);
        }
    }

    /**
     * 设置百分比
     *
     * @param dos
     * @param totals
     */
    private void setPrecent(long dos, long totals, ThreadContext context) {
        NumberFormat nt = NumberFormat.getPercentInstance();
        //设置百分数精确度2即保留两位小数
        nt.setMinimumFractionDigits(2);
        if (dos<0) dos=0l;
        float baifen = (float) dos / totals;
        context.set("importPercent", nt.format(baifen));
    }

    private PreUserRackApi getPreUserRackApi() {
        return SpringUtil.getBean(PreUserRackApi.class);
    }

    private ImportTaskMapper getImportTaskMapper() {
        return SpringUtil.getBean(ImportTaskMapper.class);
    }

    private ThreadContext getThreadContext() {
        return SpringUtil.getBean(ThreadContext.class);
    }

    private File getFile() {
        File folder = new File(System.getProperty("user.dir") + "/save/" + childDir + "/");
        File[] templates = folder.listFiles(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String name) {
                if (name.trim().equals(fileName)) {
                    return true;
                }
                return false;
            }
        });
        if (templates.length > 0) {
            File file = templates[0];
            return file;
        }
        return null;
    }

    private Map<Integer, UserInformationDTO> constructUserInfo(Map<Integer, String[]> map) {

        if (map == null || map.isEmpty()) return new HashMap<>();
        Map<Integer, UserInformationDTO> userMap = new HashMap<>();
        Set<Integer> keys = map.keySet();
        for (Integer key:keys){
            String[] value = map.get(key);
            if (value[0] != null) {

                UserInformationDTO information = new UserInformationDTO();
                information.setUnitName(value[0]);
                try {

                    try {
                        if (value[1] != null) information.setNature(Integer.parseInt(value[1].substring(0, 1)));
                    }catch (Exception e){
                        userErrorDatas.add(new ImportErrorData(0, key, value, "用户属性填写异常"));
                        continue;
                    }
                    try {
                        if (value[2] != null) {

                            String[] areaList = value[2].split(",");
                            StringBuilder sb = new StringBuilder();
                            for (String area : areaList) {
                                if (area.indexOf("-") > 0) {
                                    sb.append(area.substring(0, area.indexOf("-"))).append(",");
                                } else {
                                    sb.append(area).append(",");
                                }
                            }
                            information.setIdentify(sb.substring(0, sb.length() - 1));
                        }
                    }catch (Exception e){
                        userErrorDatas.add(new ImportErrorData(0, key, value, "用户标识填写异常"));
                        continue;
                    }
                    try {
                        if (value[3] != null) {
                            if (value[3].indexOf("-") > 0) {
                                information.setUnitNature(Integer.parseInt(value[3].substring(0, value[3].indexOf("-"))));
                            } else {
                                information.setUnitNature(Integer.parseInt(value[3]));
                            }
                        }
                    }catch (Exception e){
                        userErrorDatas.add(new ImportErrorData(0, key, value, "单位属性填写异常"));
                        continue;
                    }
                    try {
                        if (value[4] != null) {
                            if (value[4].indexOf("-") > 0) {
                                information.setIdType(Integer.parseInt(value[4].substring(0, value[4].indexOf("-"))));
                            } else {
                                information.setIdType(Integer.parseInt(value[4]));
                            }
                        }
                    }catch (Exception e){
                        userErrorDatas.add(new ImportErrorData(0, key, value, "证件类型填写异常"));
                        continue;
                    }
                    if (value[5] != null) information.setIdNumber(value[5]);
                    if (value[6] != null) {
                        information.setUnitAddressProvinceName(value[6]);
                    }else {
                        userErrorDatas.add(new ImportErrorData(0, key, value, "省份为空"));
                        continue;
                    }
                    if ("北京市,上海市，天津市，重庆市".indexOf(information.getUnitAddressProvinceName())>-1){
                        if (value[7] != null && !value[7].equals(information.getUnitAddressProvinceName())){
                            //第二级有填，但是在第一级是北京市,上海市，天津市，重庆市的情况下不一致就报错
                            userErrorDatas.add(new ImportErrorData(0, key, value, "市（自治州|地区|盟）填写错误"));
                            continue;
                        }
                        information.setUnitAddressCityName(information.getUnitAddressProvinceName());
                    }else if (value[7] != null) {
                        information.setUnitAddressCityName(value[7]);
                    }else {
                        userErrorDatas.add(new ImportErrorData(0, key, value, "市（自治州|地区|盟）为空"));
                        continue;
                    }
                    if (value[8] != null) information.setUnitAddressAreaName(value[8]);
                    if (value[9] != null) information.setUnitAddress(value[9]);
                    if (value[10] != null) information.setRegisteTime(value[10]);
                    if (value[11] != null) information.setServiceRegTime(value[11]);
                    if (value[12] != null) information.setOfficerName(value[12]);
                    try {
                        if (value[13] != null) {
                            if (value[13].indexOf("-") > 0) {
                                information.setOfficerIdType(Integer.parseInt(value[13].substring(0, value[13].indexOf("-"))));
                            } else {
                                information.setOfficerIdType(Integer.parseInt(value[13]));
                            }
                        }
                    }catch (Exception e){
                        userErrorDatas.add(new ImportErrorData(0, key, value, "网络信息安全责任人证件类型填写异常"));
                        continue;
                    }
                    if (value[14] != null) information.setOfficerId(value[14]);
                    if (value[15] != null) information.setOfficerTelphone(value[15]);
                    if (value[16] != null) information.setOfficerMobile(value[16]);
                    if (value[17] != null) information.setOfficerEmail(value[17]);
                    try {
                        if (value[18] != null) {
                            String[] areaList = value[18].split(",");
                            StringBuilder sb = new StringBuilder();
                            for (String area : areaList) {
                                if (area.indexOf("-") > 0) {
                                    sb.append(area.substring(0, area.indexOf("-"))).append(",");
                                } else {
                                    sb.append(area).append(",");
                                }
                            }
                            information.setAreaCode(sb.substring(0, sb.length() - 1));
                        }
                    }catch (Exception e){
                        userErrorDatas.add(new ImportErrorData(0, key, value, "隶属单位填写异常"));
                        continue;
                    }
                    try {
                        if (value.length>=20 && value[19] != null) {
                            if (value[19].indexOf("-") > 0) {
                                information.setCover(Integer.parseInt(value[19].substring(0, value[19].indexOf("-"))));
                            } else {
                                information.setCover(Integer.parseInt(value[19]));
                            }
                        }
                    }catch (Exception e){
                        userErrorDatas.add(new ImportErrorData(0, key, value, "是否覆盖标识异常"));
                        continue;
                    }
                    information.setAuthFilter(true);
                    userMap.put(key, information);
                } catch (Exception e) {
                    logger.error("", e);
                    userErrorDatas.add(new ImportErrorData(0, key, value, "该行数据格式异常"));
                }
            } else {
                userErrorDatas.add(new ImportErrorData(0, key, value, "用户名称为空"));
            }
        }
        return userMap;
    }

    private Map<Integer, UserServiceInformationDTO> constructUserServiceInfo(Map<Integer, String[]> map) {
        if (map == null || map.isEmpty()) return new HashMap<>();
        Map<Integer, UserServiceInformationDTO> userServiceMap = new HashMap<>();
        Set<Integer> keys = map.keySet();
        for (Integer key:keys) {
            String[] value = map.get(key);
            if (value[0] != null) {
                try {
                    UserServiceInformationDTO information = new UserServiceInformationDTO();
                    information.setUserName(value[0]);
                    if (value[1] != null) {
                        if (value[1].indexOf("-") > 0) {
                            information.setServiceContent(value[1].substring(0, value[1].indexOf("-")));
                        } else {
                            information.setServiceContent(value[1]);
                        }
                    }
                    try {
                        if (value[2] != null) {
                            if (value[2].indexOf("-") > 0) {
                                information.setBusiness(Integer.parseInt(value[2].substring(0, value[2].indexOf("-"))));
                            } else {
                                information.setBusiness(Integer.parseInt(value[2]));
                            }
                        }
                    }catch (Exception e){
                        userServiceErrorDatas.add(new ImportErrorData(1, key, value, "业务类型填写异常"));
                        continue;
                    }
                    if (value[3] != null) {
                        String[] domins = value[3].split(";");
                        List<ServiceDomainInformation> list = new ArrayList<ServiceDomainInformation>();
                        for (String domin : domins) {
                            ServiceDomainInformation serviceDomainInformation = new ServiceDomainInformation();
                            serviceDomainInformation.setDomainName(domin);
                            list.add(serviceDomainInformation);
                        }
                        information.setDomainList(list);
                    }
                    try {
                        if (value[4] != null&&value[4]!="") {
                            if (value[4].indexOf("-") > 0) {
                                information.setRegType(Integer.parseInt(value[4].substring(0, value[4].indexOf("-"))));
                            } else {
                                information.setRegType(Integer.parseInt(value[4]));
                            }
                        }
                    }catch (Exception e){
                        userServiceErrorDatas.add(new ImportErrorData(1, key, value, "网站备案类型填写异常"));
                        continue;
                    }
                    if (value[5] != null&&value[5]!=""){
                    	information.setRegisterId(value[5]);
                    	String rkey = value[0]+value[5];
                    	if(registerIdMap.containsKey(rkey)){
                    		userServiceErrorDatas.add(new ImportErrorData(1, key, value, "该用户服务重复占用该备案号信息"));
                            continue;
                    	}else{
                    		registerIdMap.put(rkey, rkey);
                    		information.setRegisterId(value[5]);
                    	}
                    }
                    
                    try {
                        if (value[6] != null) {
                            if (value[6].indexOf("-") > 0) {
                                information.setSetmode(Integer.parseInt(value[6].substring(0, value[6].indexOf("-"))));
                            } else {
                                information.setSetmode(Integer.parseInt(value[6]));
                            }
                        }
                    }catch (Exception e){
                        userServiceErrorDatas.add(new ImportErrorData(1, key, value, "接入方式填写异常"));
                        continue;
                    }
                    if (value[7] != null) {
                        String[] areaList = value[7].split(",");
                        StringBuilder sb = new StringBuilder();
                        for (String area : areaList) {
                            if (area.indexOf("-") > 0) {
                                sb.append(area.substring(0, area.indexOf("-"))).append(",");
                            } else {
                                sb.append(area).append(",");
                            }
                        }
                        information.setAreaCode(sb.substring(0, sb.length() - 1));
                    }
                    information.setAuthFilter(true);
                    information.setServiceType(1);
                    information.setAddType(3);
                    userServiceMap.put(key, information);
                } catch (Exception e) {
                    logger.error("", e);
                    userServiceErrorDatas.add(new ImportErrorData(1, key, value, "该行数据格式异常"));
                }
            } else {
                userServiceErrorDatas.add(new ImportErrorData(1, key, value, "用户名称为空"));
            }

        }
        return userServiceMap;
    }

    private Map<Integer, UserBandwidthInformationDTO> constructUserBandInfo(Map<Integer, String[]> map) {
        if (map == null || map.isEmpty()) return new HashMap<>();
        Map<Integer, UserBandwidthInformationDTO> userBandMap = new HashMap<>();
        Set<Integer> keys = map.keySet();
        for (Integer key:keys) {
            String[] value = map.get(key);
            if (value[0] != null) {
                try {
                    UserBandwidthInformationDTO bandwidthInformation = new UserBandwidthInformationDTO();
                    bandwidthInformation.setUserName(value[0]);
                    if (value[1] != null) {
                        bandwidthInformation.setHouseName(value[1]);
                    }else {
                        userBandErrorDatas.add(new ImportErrorData(2, key, value, "机房为空"));
                        continue;
                    }
                    if (value[2] != null) bandwidthInformation.setDistributeTime(value[2]);
                    try {
                        if (value[3] != null) bandwidthInformation.setBandWidth(Long.valueOf(value[3]));
                    }catch (Exception e){
                        userBandErrorDatas.add(new ImportErrorData(2, key, value, "带宽填写有误，请填写正确的非负整数"));
                        continue;
                    }

                    if (value[4] != null) {
                        String[] areaList = value[4].split(",");
                        StringBuilder sb = new StringBuilder();
                        for (String area : areaList) {
                            if (area.indexOf("-") > 0) {
                                sb.append(area.substring(0, area.indexOf("-"))).append(",");
                            } else {
                                sb.append(area).append(",");
                            }
                        }
                        bandwidthInformation.setAreaCode(sb.substring(0, sb.length() - 1));
                    }
                    bandwidthInformation.setAuthFilter(true);
                    userBandMap.put(key, bandwidthInformation);
                } catch (Exception e) {
                    logger.error("", e);
                    userBandErrorDatas.add(new ImportErrorData(2, key, value, "该行数据格式异常"));
                }
            } else {
                userBandErrorDatas.add(new ImportErrorData(2, key, value, "用户名称为空"));

            }
        }
        return userBandMap;
    }

    private Map<Integer, UserVirtualInformationDTO> constructUserVirInfo(Map<Integer, String[]> map) {
        if (map == null || map.isEmpty()) return new HashMap<>();
        Map<Integer, UserVirtualInformationDTO> userVirMap = new HashMap<>();
        Set<Integer> keys = map.keySet();
        for (Integer key:keys) {
            String[] value = map.get(key);
            if (value[0] != null) {
                try {
                    UserVirtualInformationDTO virtualInformation = new UserVirtualInformationDTO();
                    virtualInformation.setUserName(value[0]);
                    if (value[1] != null) {
                        virtualInformation.setHouseName(value[1]);
                    }else {
                        userVirErrorDatas.add(new ImportErrorData(3, key, value, "机房名称为空"));
                        continue;
                    }
                    if (value[2] != null) virtualInformation.setVirtualNo(value[2]);
                    if (value[3] != null) virtualInformation.setName(value[3]);
                    if (value[4] != null) virtualInformation.setNetworkAddress(value[4]);
                    if (value[5] != null) virtualInformation.setMgnAddress(value[5]);
                    try {
                        if (value[6] != null) {
                            if (value[6].indexOf("-") > 0) {
                                virtualInformation.setStatus(Integer.parseInt(value[6].substring(0, value[6].indexOf("-"))));
                            } else {
                                virtualInformation.setStatus(Integer.parseInt(value[6]));
                            }
                        }
                    }catch (Exception e){
                        userVirErrorDatas.add(new ImportErrorData(3, key, value, "虚拟主机状态填写异常"));
                        continue;
                    }
                    try {
                        if (value[7] != null) {
                            if (value[7].indexOf("-") > 0) {
                                virtualInformation.setType(Integer.parseInt(value[7].substring(0, value[7].indexOf("-"))));
                            } else {
                                virtualInformation.setType(Integer.parseInt(value[7]));
                            }
                        }
                    }catch (Exception e){
                        userVirErrorDatas.add(new ImportErrorData(3, key, value, "虚拟主机类型填写异常"));
                        continue;
                    }
                    if (value[8] != null) {
                        String[] areaList = value[8].split(",");
                        StringBuilder sb = new StringBuilder();
                        for (String area : areaList) {
                            if (area.indexOf("-") > 0) {
                                sb.append(area.substring(0, area.indexOf("-"))).append(",");
                            } else {
                                sb.append(area).append(",");
                            }
                        }
                        virtualInformation.setAreaCode(sb.substring(0, sb.length() - 1));
                    }
                    virtualInformation.setAuthFilter(true);
                    userVirMap.put(key, virtualInformation);
                } catch (Exception e) {
                    logger.error("", e);
                    userVirErrorDatas.add(new ImportErrorData(3, key, value, "该行数据格式异常"));
                }
            } else {
                userVirErrorDatas.add(new ImportErrorData(3, key, value, "用户名称为空"));
            }
        }
        return userVirMap;
    }
    private void prepareImport( BaseModel model,ImportTaskModel importTaskModel){
        model.setCreateUserId(importTaskModel.getCreateUserId().intValue());
        model.setUpdateUserId(importTaskModel.getUpdateUserId().intValue());
        model.setCityCodeList(importTaskModel.getCityCodeList());
        model.setUserAuthIdentityList(importTaskModel.getUserAuthIdentityList());
        model.setUserAuthHouseList(importTaskModel.getUserAuthHouseList());
    }
}
