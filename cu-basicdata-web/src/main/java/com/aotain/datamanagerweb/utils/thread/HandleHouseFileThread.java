package com.aotain.datamanagerweb.utils.thread;

import com.alibaba.fastjson.JSON;
import com.aotain.cu.serviceapi.dto.*;
import com.aotain.cu.serviceapi.model.*;
import com.aotain.cu.utils.DateUtils;
import com.aotain.datamanagerweb.constant.DataPermissionConstant;
import com.aotain.datamanagerweb.constant.HouseImportTaskModel;
import com.aotain.datamanagerweb.constant.ImportConstant;
import com.aotain.datamanagerweb.mapper.dic.DictionaryMapper;
import com.aotain.datamanagerweb.mapper.export.HouseExportMapper;
import com.aotain.datamanagerweb.mapper.task.ImportTaskMapper;
import com.aotain.datamanagerweb.properties.AuthConstantProperty;
import com.aotain.datamanagerweb.serviceapi.*;
import com.aotain.datamanagerweb.utils.ExcelUtil;
import com.aotain.datamanagerweb.utils.SpringUtil;
import com.aotain.datamanagerweb.utils.dataimport.ImportErrorData;
import com.aotain.login.pojo.DataPermission;
import com.aotain.login.pojo.UserDetailInfo;
import com.aotain.login.support.Authority;
import com.google.common.collect.Lists;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.text.NumberFormat;
import java.util.*;
import java.util.concurrent.FutureTask;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Demo class
 *
 * @author bang
 * @date 2018/08/22
 */
public class HandleHouseFileThread extends Thread{

    private Logger logger = LoggerFactory.getLogger(HandleHouseFileThread.class);

    private static final int BATCH_INSERT_NUM = 100;

    private static final String SPLIT_BAR = "-";
    private static final String SPLIT_COMMA = ",";
    private static final String SPLIT_SEMICOLON = ";";

    private String fileName;
    private String childDir;
    private Long taskId;
    private HouseImportTaskModel importTaskModel;

    private List<ImportErrorData> houseErrorDatas = new ArrayList<ImportErrorData>();
    private List<ImportErrorData> houseFrameErrorDatas = new ArrayList<ImportErrorData>();
    private List<ImportErrorData> houseLinkErrorDatas = new ArrayList<ImportErrorData>();
    private List<ImportErrorData> houseIpSegErrorDatas = new ArrayList<ImportErrorData>();

    public HandleHouseFileThread( String fileName, String childDir, Long taskId,HouseImportTaskModel model) {
        super();
        this.fileName=fileName;
        this.childDir=childDir;
        this.taskId=taskId;
        this.importTaskModel =model;
    }

    @Override
    public void run() {
        File dataFile = getFile();
        ImportTaskMapper mapper = getImportTaskMapper();
        ThreadContext context =getThreadContext();
        PreHouseInfoApi houseInfoApi = getHouseInfoApi();
        PreHouseLinkApi houseLinkApi = getHouseLinkApi();
        PreHouseRackApi houseRackApi = getHouseRackApi();
        PreHouseIPSegmentApi houseIPSegmentApi = getHouseIpSegApi();
        try {
            //  sheet		 rowNum		content  : 表 行  内容
            long start = System.currentTimeMillis();
            Map<Integer, Map<Integer, String[]>> map = ExcelUtil.readExcelFromStream(new FileInputStream(dataFile));
            long end = System.currentTimeMillis();
            logger.info("it takes "+(end-start)+" ms to read data from excel");
            if (map!=null && !map.isEmpty()) {
                Map<Integer, String[]> houseInfoMap = map.get(0);
                Map<Integer, String[]> houseFrameMap = map.get(1);
                Map<Integer, String[]> houseLinkMap = map.get(2);
                Map<Integer, String[]> houseIpSegMap = map.get(3);

                long start1 = System.currentTimeMillis();
                List<HouseInformationDTO> houseInformationDTOList = constructHouseInfo(houseInfoMap);
                long end1 = System.currentTimeMillis();
                logger.info("it takes "+(end1-start1)+" ms to construct house info model");

                AtomicLong handleNum = new AtomicLong(0);

                if (houseInformationDTOList!=null && !houseInformationDTOList.isEmpty()) {
                    try{
                        houseInformationDTOList.forEach(value -> {
                            setBasicProperty(value);
                            value.setAppId(importTaskModel.getAppId());
                            value.setDataPermissionId(importTaskModel.getDataPermissionId());
                            value.setDataPermissionToken(importTaskModel.getDataPermissionToken());
                            value.setDataPermissionName(importTaskModel.getDataPermissionName());
                            value.setDataPermissionDesc(importTaskModel.getDataPermissionDesc());
                            value.setPermissionMethodUrl(importTaskModel.getPermissionMethodUrl());
                            value.setUserToken(importTaskModel.getUserToken());
                            value.setDataPermissionSettingList(importTaskModel.getDataPermissionSettingList());
                        });
                        List<ResultDto> resultDtoList = houseInfoApi.importHouseData(houseInformationDTOList);
                        if (resultDtoList!=null && !resultDtoList.isEmpty()){
                            for (int i=0;i<resultDtoList.size();i++){
                                ResultDto resultDto = resultDtoList.get(i);
                                if (resultDto.getResultCode() == ResultDto.ResultCodeEnum.ERROR.getCode().intValue()) {
                                    houseErrorDatas.add(new ImportErrorData(0, i, getContent(houseInformationDTOList.get(i)), resultDto.getResultMsg().replace("[","").replace("]","").replace("\"","")));
                                }
                            }
                        }
                        handleNum.addAndGet(houseInformationDTOList.size());
                    } catch (Exception e){
                        logger.error("batch insert houseinfo fail",e);
                        if (houseInformationDTOList!=null){
                            for (int i=0;i<houseInformationDTOList.size();i++){
                                houseErrorDatas.add(new ImportErrorData(0, i, getContent(houseInformationDTOList.get(i)), "数据写入异常"));
                            }
                        }
                        handleNum.addAndGet(houseInformationDTOList.size());
                    }
                }
//                try{
//                    synchroHouseAuthInfo(importTaskModel.getHttpServletRequest());
//                } catch (Exception e){
//                    logger.info("synch house auth fail",e);
//                }

                long houseNum = houseInfoMap==null?0:houseInfoMap.size();
                long frameNum = houseFrameMap==null?0:houseFrameMap.size();
                long ipNum = houseIpSegMap==null?0:houseIpSegMap.size();
                long gatewayNum = houseLinkMap==null?0:houseLinkMap.size();
                long roughNum = houseNum+frameNum+ipNum+gatewayNum;
                setPrecent(handleNum.longValue(), roughNum,context);


                long start2 = System.currentTimeMillis();
                List<HouseFrameInformationDTO> houseFrameInformationDTOList = constructHouseFrameInfo(houseFrameMap,importTaskModel.getUpdateUserId());
                List<HouseGatewayInformationDTO> houseGatewayInformationDTOList = constructHouseGatewayInfo(houseLinkMap);
                List<HouseIPSegmentInforDTO> houseIPSegmentInforDTOList = constructHouseIPSegmentInfo(houseIpSegMap);
                long end2 = System.currentTimeMillis();
                logger.info("it takes "+(end2-start2)+" ms to construct other model");

                long totalNum = 0L;
                if (houseInfoMap!=null){
                    totalNum += Long.valueOf(houseInfoMap.size());
                }
                if (houseFrameInformationDTOList!=null){
                    totalNum += Long.valueOf(houseFrameInformationDTOList.size());
                }
                if (houseGatewayInformationDTOList!=null){
                    totalNum += Long.valueOf(houseGatewayInformationDTOList.size());
                }
                if (houseIPSegmentInforDTOList!=null){
                    totalNum += Long.valueOf(houseIPSegmentInforDTOList.size());
                }

                if (houseFrameInformationDTOList!=null && !houseFrameInformationDTOList.isEmpty()) {

                    houseFrameInformationDTOList.forEach( value  -> {
                        setBasicProperty(value);
                    });
                    long starta = System.currentTimeMillis();
                    importFrameList(houseFrameInformationDTOList,handleNum,totalNum);
                    long enda = System.currentTimeMillis();
                    logger.info("it takes "+(enda-starta)+" ms to import house frame data");

                }
                logger.info("there is "+(houseFrameErrorDatas==null?0:houseFrameErrorDatas.size())+" house frame data import fail");
                setPrecent(handleNum.longValue(), totalNum,context);

                if (houseIPSegmentInforDTOList!=null&&!houseIPSegmentInforDTOList.isEmpty()) {
                    houseIPSegmentInforDTOList.forEach(value -> {
                        setBasicProperty(value);
                    });
                    long startb = System.currentTimeMillis();
                    importIpList(houseIPSegmentInforDTOList,handleNum,totalNum);
                    long endb = System.currentTimeMillis();
                    logger.info("it takes "+(endb-startb)+" ms to import house ip data");
                }
                logger.info("there is "+(houseIpSegErrorDatas==null?0:houseIpSegErrorDatas.size())+" house ip data import fail");
                setPrecent(handleNum.longValue(), totalNum,context);

                if (houseGatewayInformationDTOList!=null && houseGatewayInformationDTOList.size() > 0) {
                    houseGatewayInformationDTOList.forEach(value  -> {
                        setBasicProperty(value);
                    });

                    List<List<HouseGatewayInformationDTO>> sepGatewayList = Lists.partition(houseGatewayInformationDTOList,BATCH_INSERT_NUM);
                    if (sepGatewayList!=null && !sepGatewayList.isEmpty()){
                        for (int i=0;i<sepGatewayList.size();i++){
                            List<HouseGatewayInformationDTO> houseGatewayInformationDTOList1 = sepGatewayList.get(i);
                            try {

                                List<ResultDto> resultDtoList = houseLinkApi.importHouseLink(houseGatewayInformationDTOList1);
                                if (resultDtoList!=null && !resultDtoList.isEmpty()){
                                    for (int j=0;j<resultDtoList.size();j++){
                                        ResultDto resultDto = resultDtoList.get(j);
                                        if (resultDto.getResultCode() == ResultDto.ResultCodeEnum.ERROR.getCode().intValue()) {
                                            if (resultDto.getAjaxValidationResultMap()!=null && !resultDto.getAjaxValidationResultMap().isEmpty()){
                                                houseLinkErrorDatas.add(new ImportErrorData(3, j, getContent(houseGatewayInformationDTOList1.get(j)), resultDto.getAjaxValidationResultMap().get("0").getErrorsToString().replace("[","").replace("]","")));
                                            }
                                        }
                                    }
                                }

                                handleNum.addAndGet(houseGatewayInformationDTOList1.size());
                                setPrecent(handleNum.longValue(), totalNum,context);
                            } catch (Exception e) {
                                logger.info("batch insert fail",e);
                                if (houseGatewayInformationDTOList1!=null){
                                    for (int j=0;j<houseGatewayInformationDTOList1.size();j++){
                                        houseLinkErrorDatas.add(new ImportErrorData(3, j, getContent(houseGatewayInformationDTOList1.get(j)), "数据写入异常"));
                                    }
                                }
                                handleNum.addAndGet(houseGatewayInformationDTOList1.size());
                                setPrecent(handleNum.longValue(), totalNum,context);
                            }

                        }
                    }
                }
                setPrecent(handleNum.longValue(), totalNum,context);

                //导入已经完成,接下来更新数据库和生成错误文件
                setPrecent(9999, 10000,context);
                if (houseErrorDatas.isEmpty()  &&  houseFrameErrorDatas.isEmpty() &&
                        houseLinkErrorDatas.isEmpty() && houseIpSegErrorDatas.isEmpty()){
                    context.set("status","done");
                    ImportTaskModel model =new ImportTaskModel();
//                    model.setErrorFileName(errorFile);
                    model.setStatus(ImportConstant.StatusEum.IMPORT_SUCCESS.getType());
                    model.setTaskId(taskId);
                    mapper.update(model);

                }else {
                    Map<String,List<ImportErrorData>> dataMap = new HashMap<>();
                    dataMap.put("机房主体信息",houseErrorDatas);
                    dataMap.put("机房机架信息",houseFrameErrorDatas);
                    dataMap.put("机房链路信息",houseLinkErrorDatas);
                    dataMap.put("机房IP地址段信息",houseIpSegErrorDatas);
                    String errorFile = fileName.substring(0,fileName.lastIndexOf("."))+"_error";
                    ExcelUtil.createExcelWithTemplate(dataMap,"house","houseInformationTemplate",errorFile,"xlsm");

                    ImportTaskModel model =new ImportTaskModel();
                    model.setTaskType(ImportConstant.TaskTypeEum.HOUSE.getType());
                    model.setErrorFileName(errorFile);
                    // 部分导入成功也是导入成功
                    model.setStatus(ImportConstant.StatusEum.IMPORT_SUCCESS.getType());
                    model.setTaskId(taskId);
                    mapper.update(model);
                }
                setPrecent(1, 1,context);
            }else {
                context.set("status","undone");
                ImportTaskModel model =new ImportTaskModel();
                model.setStatus(ImportConstant.StatusEum.IMPORT_FAIL.getType());
                model.setTaskId(taskId);
                mapper.update(model);
            }
        } catch (Exception e) {
            logger.error("read data from excel error",e);
            context.set("status","undone");
            ImportTaskModel model =new ImportTaskModel();
            model.setStatus(ImportConstant.StatusEum.IMPORT_FAIL.getType());
            model.setTaskId(taskId);
            mapper.update(model);
        }

    }

    /**
     * 设置百分比
     * @param dos
     * @param totals
     */
    private void setPrecent(long dos,long totals,ThreadContext context){
        NumberFormat nt = NumberFormat.getPercentInstance();
        //设置百分数精确度2即保留两位小数
        nt.setMinimumFractionDigits(2);
        float baifen = (float)dos/totals;
        context.set("importPercent",nt.format(baifen));
    }

    private File getFile() {
        File folder = new File( System.getProperty("user.dir")+"/save/"+ childDir+"/");
        File[] templates = folder.listFiles(new FilenameFilter() {
            @Override
            public boolean accept( File dir, String name ) {
                if (name.trim().equals(fileName)) {
                    return true;
                }
                return false;
            }
        });
        if (templates.length > 0) {
            File file = templates[0];
            return  file;
        }
        return null;
    }

    private ImportTaskMapper getImportTaskMapper(){
        return SpringUtil.getBean(ImportTaskMapper.class);
    }

    private ThreadContext getThreadContext(){
        return SpringUtil.getBean(ThreadContext.class);
    }

    private PreHouseInfoApi getHouseInfoApi(){
        return SpringUtil.getBean(PreHouseInfoApi.class);
    }

    private PreHouseRackApi getHouseRackApi(){
        return SpringUtil.getBean(PreHouseRackApi.class);
    }

    private PreHouseLinkApi getHouseLinkApi(){
        return SpringUtil.getBean(PreHouseLinkApi.class);
    }

    private PreHouseIPSegmentApi getHouseIpSegApi(){
        return SpringUtil.getBean(PreHouseIPSegmentApi.class);
    }

    private DictionaryMapper getDictionaryMapper(){
        return SpringUtil.getBean(DictionaryMapper.class);
    }

    private HouseExportMapper getHouseExportMapper(){
        return SpringUtil.getBean(HouseExportMapper.class);
    }

    /**
     * 设置权限相关属性值
     * @param value
     */
    private void setBasicProperty(BaseModel value){
        value.setUpdateUserId(importTaskModel.getUpdateUserId());
        value.setCityCodeList(importTaskModel.getCityCodeList());
        value.setUserAuthIdentityList(importTaskModel.getUserAuthIdentityList());
        value.setUserAuthHouseList(importTaskModel.getUserAuthHouseList());
        value.setCreateUserId( importTaskModel.getCreateUserId().intValue());
    }

    /**
     * 根据导入excel数据生成对应的实体对象
     * @param houseInformationMap
     * @return
     */
    private List<HouseInformationDTO> constructHouseInfo(Map<Integer, String[]> houseInformationMap){
        if (houseInformationMap==null || houseInformationMap.isEmpty()){
            return null;
        }

        // 部署省份
        DictionaryMapper dictionaryMapper = getDictionaryMapper();
        HouseExportMapper houseExportMapper = getHouseExportMapper();
        String provinceCode = dictionaryMapper.getDeployProvinceCodeByCode().getCode();

        List<HouseInformationDTO> houseInformationDTOList= Lists.newArrayList();
        houseInformationMap.forEach( (key,value) -> {
            if (!emptyStrArray(value)){
                if ( value[0]!=null) {
                    HouseInformationDTO information=new HouseInformationDTO();
                    // 导入
                    information.setAddType(3);
                    information.setUpdateTime(new Date());
                    information.setHouseIdStr(value[0]);
                    if (StringUtils.isEmpty(value[0])){
                        houseErrorDatas.add(new ImportErrorData(0,key,value,"机房编号为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[1])){
                        houseErrorDatas.add(new ImportErrorData(0,key,value,"机房名称为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[2])){
                        houseErrorDatas.add(new ImportErrorData(0,key,value,"专线标识为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[3])){
                        houseErrorDatas.add(new ImportErrorData(0,key,value,"机房性质为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[4])){
                        houseErrorDatas.add(new ImportErrorData(0,key,value,"市（自治州|地区|盟）为空"));
                        return;
                    }

                    if (StringUtils.isEmpty(value[6])){
                        houseErrorDatas.add(new ImportErrorData(0,key,value,"机房地址为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[7])){
                        houseErrorDatas.add(new ImportErrorData(0,key,value,"网络信息安全\n" +
                                "责任人姓名为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[8])){
                        houseErrorDatas.add(new ImportErrorData(0,key,value,"网络信息安全\n" +
                                "责任人证件类型为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[9])){
                        houseErrorDatas.add(new ImportErrorData(0,key,value,"网络信息安全\n" +
                                "责任人证件号码为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[10])){
                        houseErrorDatas.add(new ImportErrorData(0,key,value,"网络信息安全\n" +
                                "责任人固定电话为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[11])){
                        houseErrorDatas.add(new ImportErrorData(0,key,value,"网络信息安全\n" +
                                "责任人移动电话为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[12])){
                        houseErrorDatas.add(new ImportErrorData(0,key,value,"网络信息安全\n" +
                                "责任人Email为空"));
                        return;
                    }

                    try {
                        information.setHouseProvince(Integer.valueOf(provinceCode));

                        if (value[1] != null) {
                            information.setHouseName(value[1]);
                            String houseId = houseExportMapper.getHouseIdByHouseName(value[1]);
                            if ( !StringUtils.isEmpty(houseId) ){
                                information.setHouseId(Long.valueOf(houseId));
                            }
                        }
                        try{
                            if (value[2] != null) {
                                if (value[2].contains(SPLIT_BAR)){
                                    information.setIdentify(value[2].split(SPLIT_BAR)[0]);
                                    information.setIdentity(Integer.valueOf(value[2].split(SPLIT_BAR)[0]));
                                } else {
                                    information.setIdentify(value[2]);
                                    information.setIdentity(Integer.valueOf(value[2]));
                                }

                            }
                        } catch (Exception e){
                            houseErrorDatas.add(new ImportErrorData(0,key,value,"专线标识填写异常"));
                            return;
                        }
                        try{
                            if (value[3] != null) {
                                if (value[3].contains(SPLIT_BAR)){
                                    information.setHouseType(Integer.valueOf(value[3].split(SPLIT_BAR)[0]));
                                } else {
                                    information.setHouseType(Integer.valueOf(value[3]));
                                }

                            }
                        }  catch (Exception e){
                            houseErrorDatas.add(new ImportErrorData(0,key,value,"机房性质填写异常"));
                            return;
                        }

                        IdcJcdmXzqydm idcJcdmXzqydm = new IdcJcdmXzqydm();
                        if (value[4] != null) {
                            IdcJcdmXzqydm searchCondition = new IdcJcdmXzqydm();
                            searchCondition.setMc(value[4]);
                            searchCondition.setParentCode(provinceCode);
                            idcJcdmXzqydm = dictionaryMapper.getXzqydmCodeByMC(searchCondition);
                            if (idcJcdmXzqydm==null){
                                houseErrorDatas.add(new ImportErrorData(0,key,value,"输入的市、区不在本省范围内"));
                                return;
                            } else if (idcJcdmXzqydm!=null && !StringUtils.isEmpty(idcJcdmXzqydm.getCode())){
                                information.setHouseCity(Integer.valueOf(idcJcdmXzqydm.getCode()));
                            }
                        }

                        if (value[5] != null && idcJcdmXzqydm!=null) {
                            IdcJcdmXzqydm searchCondition2 = new IdcJcdmXzqydm();
                            searchCondition2.setMc(value[5]);
                            searchCondition2.setParentCode(idcJcdmXzqydm.getCode());
                            IdcJcdmXzqydm idcJcdmXzqydm2 = dictionaryMapper.getXzqydmCodeByMC(searchCondition2);
                            if (idcJcdmXzqydm2==null) {
                                houseErrorDatas.add(new ImportErrorData(0,key,value,"输入的市、区不在本省范围内"));
                                return;
                            } else if (idcJcdmXzqydm2!=null && !StringUtils.isEmpty(idcJcdmXzqydm2.getCode())) {
                                information.setHouseCounty(Integer.valueOf(idcJcdmXzqydm2.getCode()));
                            }
                        }

                        if (information.getHouseCity()==null||information.getHouseCity()==0){
                            information.setHouseCity(Integer.valueOf(provinceCode));
                        }

                        if (information.getHouseCounty()==null||information.getHouseCounty()==0){
                            if (information.getHouseCity()!=null&&information.getHouseCity()!=0){
                                information.setHouseCounty(Integer.valueOf(information.getHouseCity()));
                            } else {
                                information.setHouseCounty(Integer.valueOf(provinceCode));
                            }
                        }

                        if (value[6] != null) {
                            information.setHouseAddress(value[6]);
                        }
                        if (value[7] != null) {
                            information.setHouseOfficerName(value[7]);
                        }
                        try{
                            if (value[8] != null) {
                                if (value[8].contains(SPLIT_BAR)){
                                    information.setHouseOfficerIdType(Integer.valueOf(value[8].split(SPLIT_BAR)[0]));
                                } else {
                                    information.setHouseOfficerIdType(Integer.valueOf(value[8]));
                                }

                            }
                        } catch (Exception e){
                            houseErrorDatas.add(new ImportErrorData(0,key,value,"网络信息安全\n" +
                                    "责任人证件类型填写异常"));
                            return;
                        }

                        if (value[9] != null) {
                            information.setHouseOfficerId(value[9]);
                        }
                        if (value[10] != null) {
                            information.setHouseOfficerTelephone(value[10]);
                        }
                        if (value[11] != null) {
                            information.setHouseOfficerMobile(value[11]);
                        }
                        if (value[12] != null) {
                            information.setHouseOfficerEmail(value[12]);
                        }
                        houseInformationDTOList.add(information);
                    }catch (Exception e){
                        logger.error("",e);
                        houseErrorDatas.add(new ImportErrorData(0,key,value,"模板参数有误,请严格按照模板填写"));
                    }
                }else {
                    houseErrorDatas.add(new ImportErrorData(0,key,value,"机房编号为空,该条数据不会进行验证"));
                }
            }
        });
        return houseInformationDTOList;
    }

    private List<HouseFrameInformationDTO> constructHouseFrameInfo(Map<Integer, String[]> houseFrameMap,int userId){

        if (houseFrameMap==null || houseFrameMap.isEmpty()){
            return null;
        }

        List<HouseFrameInformationDTO> houseFrameInformationDTOList= Lists.newArrayList();
        houseFrameMap.forEach( (key,value) -> {
            if (!emptyStrArray(value)){
                if ( value[0]!=null) {
                    if (StringUtils.isEmpty(value[1])){
                        houseFrameErrorDatas.add(new ImportErrorData(1,key,value,"机架名称为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[2])){
                        houseFrameErrorDatas.add(new ImportErrorData(1,key,value,"占用状态为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[3])){
                        houseFrameErrorDatas.add(new ImportErrorData(1,key,value,"使用类型为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[5])){
                        houseFrameErrorDatas.add(new ImportErrorData(1,key,value,"隶属分公司为空"));
                        return;
                    }
                    try{
                        HouseExportMapper houseExportMapper = getHouseExportMapper();
//                        String houseId = houseExportMapper.getHouseIdByHouseName(value[0]);

                        HouseInformationDTO houseInformationDTO = houseExportMapper.getHouseIdAndIdentify(value[0]);
                        if (houseInformationDTO == null){
                            houseFrameErrorDatas.add(new ImportErrorData(1,key,value,"机房不存在"));
                            return;
                        }
                        if (houseInformationDTO.getHouseId()==null || houseInformationDTO.getHouseId()==0){
                            houseFrameErrorDatas.add(new ImportErrorData(1,key,value,"机房不存在"));
                            return;
                        }

                        String houseId = houseInformationDTO.getHouseId().toString();
                        if (houseInformationDTO.getIdentify()!=null && "5".equals(houseInformationDTO.getIdentify()) ){
                            houseFrameErrorDatas.add(new ImportErrorData(1,key,value,"此机房为专线机房，不存在对应机架信息"));
                            return;
                        }
                        HouseFrameInformationDTO information=new HouseFrameInformationDTO();
                        information.setHouseName(value[0]);
                        if (!StringUtils.isEmpty(houseId)){
                            information.setHouseId(Long.valueOf(houseId));
                        }
                        if (value[1] != null) {
                            information.setFrameName(value[1]);
                        }
                        try{
                            if (value[2] != null) {
                                if (value[2].contains(SPLIT_BAR)){
                                    information.setOccupancy(Integer.valueOf(value[2].split(SPLIT_BAR)[0]));
                                } else {
                                    information.setOccupancy(Integer.valueOf(value[2]));
                                }

                            }
                        } catch (Exception e){
                            houseFrameErrorDatas.add(new ImportErrorData(1,key,value,"占用状态填写异常"));
                            return;
                        }

                        try{
                            if (value[3] != null) {
                                if (value[3].contains(SPLIT_BAR)){
                                    information.setUseType(Integer.valueOf(value[3].split(SPLIT_BAR)[0]));
                                } else {
                                    information.setUseType(Integer.valueOf(value[3]));
                                }

                            }
                        } catch (Exception e){
                            houseFrameErrorDatas.add(new ImportErrorData(1,key,value,"使用类型填写异常"));
                            return;
                        }

                        try{
                            if (value[4] != null) {
                                if (getValueCharLength(value[4])>128){
                                    houseFrameErrorDatas.add(new ImportErrorData(1,key,value,"客户单位超过长度"));
                                    return;
                                }

                                String[] names = value[4].split(SPLIT_SEMICOLON);
                                List<HouseUserFrameInformation> userFrameInformations = Lists.newArrayList();
                                for (int i=0;i<names.length;i++){
                                    HouseUserFrameInformation houseUserFrameInformation = new HouseUserFrameInformation();
                                    houseUserFrameInformation.setUserName(names[i]);
                                    if (!StringUtils.isEmpty(houseId)) {
                                        houseUserFrameInformation.setHouseId(Long.valueOf(houseId));
                                    }
                                    houseUserFrameInformation.setCreateTime(new Date());
                                    houseUserFrameInformation.setOperationType(1);
                                    houseUserFrameInformation.setCreateUserId(userId);
                                    userFrameInformations.add(houseUserFrameInformation);
                                }
                                information.setUserFrameList(userFrameInformations);
                                // 给机架主体使用单位赋值
                                information.setUnitName(value[4]);
                            }
                        } catch (Exception e){
                            houseFrameErrorDatas.add(new ImportErrorData(1,key,value,"客户单位填写异常"));
                            return;
                        }

                        try{
                            if (value[5] != null) {
                                String[] areaList = value[5].split(SPLIT_COMMA);
                                StringBuilder sb =new StringBuilder();
                                for (String area:areaList){
                                    if (area.indexOf(SPLIT_BAR)>0){
                                        sb.append(area.substring(0,area.indexOf(SPLIT_BAR))).append(SPLIT_COMMA);
                                    }else {
                                        sb.append(area).append(SPLIT_COMMA);
                                    }
                                }
                                information.setAreaCode(sb.substring(0,sb.length()-1));
                            }
                        } catch (Exception e){
                            houseFrameErrorDatas.add(new ImportErrorData(1,key,value,"隶属分公司填写异常"));
                            return;
                        }

                        houseFrameInformationDTOList.add(information);
                    }catch (Exception e){
                        logger.error("",e);
                        houseFrameErrorDatas.add(new ImportErrorData(1,key,value,"模板参数有误,请严格按照模板填写"));
                    }
                }else {
                    houseFrameErrorDatas.add(new ImportErrorData(1,key,value,"机房名称不存在,该条数据不会进行验证"));
                }
            }
        });
        return houseFrameInformationDTOList;
    }

    private List<HouseGatewayInformationDTO> constructHouseGatewayInfo(Map<Integer, String[]> houseGatewayMap){
        if (houseGatewayMap==null || houseGatewayMap.isEmpty()){
            return null;
        }

        List<HouseGatewayInformationDTO> houseGatewayInformationDTOList= Lists.newArrayList();
        houseGatewayMap.forEach( (key,value) -> {
            // 过滤掉空行
            if (!emptyStrArray(value)){
                if ( value[0] != null ) {
                    if (StringUtils.isEmpty(value[1])){
                        houseLinkErrorDatas.add(new ImportErrorData(2,key,value,"链路编号为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[2])){
                        houseLinkErrorDatas.add(new ImportErrorData(2,key,value,"机房互联网出入口带宽(Mbps)为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[3])){
                        houseLinkErrorDatas.add(new ImportErrorData(2,key,value,"机房出入口网关IP地址为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[4])){
                        houseLinkErrorDatas.add(new ImportErrorData(2,key,value,"隶属分公司为空"));
                        return;
                    }

                    try{
                        HouseExportMapper houseExportMapper = getHouseExportMapper();
                        String houseId = houseExportMapper.getHouseIdByHouseName(value[0]);
                        if (StringUtils.isEmpty(houseId)){
                            houseLinkErrorDatas.add(new ImportErrorData(2,key,value,"机房不存在"));
                            return;
                        }
                        HouseGatewayInformationDTO information=new HouseGatewayInformationDTO();
                        information.setHouseName(value[0]);
                        if (!StringUtils.isEmpty(houseId)){
                            information.setHouseId(Long.valueOf(houseId));
                        }

                        if (value[1] != null) {
                            information.setLinkNo(value[1]);
                        }
                        try{
                            if (value[2] != null) {
                                information.setBandWidth(Long.valueOf(value[2]));
                            }
                        } catch (Exception e){
                            houseLinkErrorDatas.add(new ImportErrorData(2,key,value,"机房互联网出入口带宽填写异常"));
                            return;
                        }

                        if (value[3] != null) {
                            information.setGatewayIP(value[3]);
                        }
                        try{
                            if (value[4] != null) {
                                String[] areaList = value[4].split(SPLIT_COMMA);
                                StringBuilder sb =new StringBuilder();
                                for (String area:areaList){
                                    if (area.indexOf(SPLIT_BAR)>0){
                                        sb.append(area.substring(0,area.indexOf(SPLIT_BAR))).append(SPLIT_COMMA);
                                    }else {
                                        sb.append(area).append(SPLIT_COMMA);
                                    }
                                }
                                information.setAreaCode(sb.substring(0,sb.length()-1));
                            }
                        } catch (Exception e){
                            houseLinkErrorDatas.add(new ImportErrorData(2,key,value,"隶属分公司填写异常"));
                            return;
                        }

                        houseGatewayInformationDTOList.add(information);
                    }catch (Exception e){
                        logger.error("",e);
                        houseLinkErrorDatas.add(new ImportErrorData(2,key,value,"模板参数有误,请严格按照模板填写"));
                    }
                }else {
                    houseLinkErrorDatas.add(new ImportErrorData(2,key,value,"机房名称不存在,该条数据不会进行验证"));
                }
            }
        });
        return houseGatewayInformationDTOList;
    }

    private List<HouseIPSegmentInforDTO> constructHouseIPSegmentInfo(Map<Integer, String[]> houseIpSegMap){
        if (houseIpSegMap==null || houseIpSegMap.isEmpty()){
            return null;
        }

        String currentDate = DateUtils.formatDateTime("yyyy-MM-dd",new Date());

        List<HouseIPSegmentInforDTO> houseIPSegmentInforDTOList= Lists.newArrayList();
        houseIpSegMap.forEach( (key,value) -> {
            // 过滤掉空行
            if (!emptyStrArray(value)){
                if ( value[0]!=null) {
                    if (StringUtils.isEmpty(value[1])){
                        houseIpSegErrorDatas.add(new ImportErrorData(3,key,value,"起始IP地址为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[2])){
                        houseIpSegErrorDatas.add(new ImportErrorData(3,key,value,"终止IP地址为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[3])){
                        houseIpSegErrorDatas.add(new ImportErrorData(3,key,value,"IP地址使用方式为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[5])){
                        houseIpSegErrorDatas.add(new ImportErrorData(3,key,value,"分配使用日期为空"));
                        return;
                    }
                    if (StringUtils.isEmpty(value[6])){
                        houseIpSegErrorDatas.add(new ImportErrorData(3,key,value,"隶属分公司为空"));
                        return;
                    }
                    try{
                        HouseIPSegmentInforDTO information=new HouseIPSegmentInforDTO();
                        HouseExportMapper houseExportMapper = getHouseExportMapper();
                        String houseId = houseExportMapper.getHouseIdByHouseName(value[0]);
                        if (StringUtils.isEmpty(houseId)){
                            houseIpSegErrorDatas.add(new ImportErrorData(3,key,value,"机房不存在"));
                            return;
                        }

                        information.setHouseName(value[0]);
                        if (!StringUtils.isEmpty(houseId)){
                            information.setHouseId(Long.valueOf(houseId));
                        }

                        if (value[1] != null) {
                            information.setStartIP(value[1]);
                        }
                        if (value[2] != null) {
                            information.setEndIP(value[2]);
                        }
                        try{
                            if (value[3] != null) {
                                if (value[3].contains(SPLIT_BAR)){
                                    information.setIpType(Integer.valueOf(value[3].split(SPLIT_BAR)[0]));
                                } else {
                                    information.setIpType(Integer.valueOf(value[3]));
                                }

                            }
                        } catch (Exception e){
                            houseIpSegErrorDatas.add(new ImportErrorData(3,key,value,"IP地址使用方式填写异常"));
                            return;
                        }

                        if (value[4] != null && (information.getIpType()!=null && information.getIpType()!=2)) {
                            information.setUserName(value[4]);
                        }
                        if (value[5] != null) {
                            if (currentDate.compareTo(value[5])<0){
                                houseIpSegErrorDatas.add(new ImportErrorData(3,key,value,"IP地址分配日期不能大于当前时间"));
                                return;
                            } else {
                                information.setUseTime(value[5]);
                            }
                        }
                        try{
                            if (value[6] != null) {
                                String[] areaList = value[6].split(SPLIT_COMMA);
                                StringBuilder sb =new StringBuilder();
                                for (String area:areaList){
                                    if (area.indexOf(SPLIT_BAR)>0){
                                        sb.append(area.substring(0,area.indexOf(SPLIT_BAR))).append(SPLIT_COMMA);
                                    }else {
                                        sb.append(area).append(SPLIT_COMMA);
                                    }
                                }
                                information.setAreaCode(sb.substring(0,sb.length()-1));
                            }
                        } catch (Exception e){
                            houseIpSegErrorDatas.add(new ImportErrorData(3,key,value,"隶属分公司填写异常"));
                            return;
                        }

                        houseIPSegmentInforDTOList.add(information);
                    }catch (Exception e){
                        logger.error("",e);
                        houseIpSegErrorDatas.add(new ImportErrorData(3,key,value,"模板参数有误,请严格按照模板填写"));
                    }
                }else {
                    houseIpSegErrorDatas.add(new ImportErrorData(3,key,value,"机房名称不存在,该条数据不会进行验证"));
                }
            }
        });
        return houseIPSegmentInforDTOList;
    }

    /**
     * 获取需要导出的内容
     * @param baseModel
     * @return
     */
    private String[] getContent(BaseModel baseModel){

        if (baseModel instanceof HouseInformationDTO){
            String[] content = new String[13];
            HouseInformationDTO houseInformationDTO = (HouseInformationDTO)baseModel;
            content[0] = houseInformationDTO.getHouseIdStr()==null?"":houseInformationDTO.getHouseIdStr();
            content[1] = houseInformationDTO.getHouseName()==null?"":houseInformationDTO.getHouseName();
            content[2] = houseInformationDTO.getIdentify()==null?"":houseInformationDTO.getIdentify();
            content[3] = houseInformationDTO.getHouseType()==null?"":houseInformationDTO.getHouseType().toString();
            content[4] = houseInformationDTO.getHouseCity()==null?"":houseInformationDTO.getHouseCity().toString();
            content[5] = houseInformationDTO.getHouseCounty()==null?"":houseInformationDTO.getHouseCounty().toString();

            content[6] = houseInformationDTO.getHouseAddress()==null?"":houseInformationDTO.getHouseAddress();
            content[7] = houseInformationDTO.getHouseOfficerName()==null?"":houseInformationDTO.getHouseOfficerName();
            content[8] = houseInformationDTO.getHouseOfficerIdType()==null?"":houseInformationDTO.getHouseOfficerIdType().toString();
            content[9] = houseInformationDTO.getHouseOfficerId()==null?"":houseInformationDTO.getHouseOfficerId().toString();
            content[10] = houseInformationDTO.getHouseOfficerTelephone()==null?"":houseInformationDTO.getHouseOfficerTelephone();
            content[11] = houseInformationDTO.getHouseOfficerMobile()==null?"":houseInformationDTO.getHouseOfficerMobile();
            content[12] = houseInformationDTO.getHouseOfficerEmail()==null?"":houseInformationDTO.getHouseOfficerEmail();
            return content;
        } else if (baseModel instanceof HouseFrameInformationDTO){
            String[] content = new String[6];
            HouseFrameInformationDTO houseFrameInformationDTO = (HouseFrameInformationDTO)baseModel;
            content[0] = houseFrameInformationDTO.getHouseName()==null?"":houseFrameInformationDTO.getHouseName();
            content[1] = houseFrameInformationDTO.getFrameName()==null?"":houseFrameInformationDTO.getFrameName();
            content[2] = houseFrameInformationDTO.getOccupancy()==null?"":houseFrameInformationDTO.getOccupancy().toString();
            content[3] = houseFrameInformationDTO.getUseType()==null?"":houseFrameInformationDTO.getUseType().toString();
            content[4] = houseFrameInformationDTO.getUnitName()==null?"":houseFrameInformationDTO.getUnitName();
            content[5] = houseFrameInformationDTO.getAreaCode()==null?"":houseFrameInformationDTO.getAreaCode();
            return content;
        } else if (baseModel instanceof HouseIPSegmentInforDTO){
            String[] content = new String[7];
            HouseIPSegmentInforDTO houseIPSegmentInforDTO = (HouseIPSegmentInforDTO)baseModel;
            content[0] = houseIPSegmentInforDTO.getHouseName()==null?"":houseIPSegmentInforDTO.getHouseName();
            content[1] = houseIPSegmentInforDTO.getStartIP()==null?"":houseIPSegmentInforDTO.getStartIP();
            content[2] = houseIPSegmentInforDTO.getEndIP()==null?"":houseIPSegmentInforDTO.getEndIP();
            content[3] = houseIPSegmentInforDTO.getIpType()==null?"":houseIPSegmentInforDTO.getIpType().toString();
            content[4] = houseIPSegmentInforDTO.getUserName()==null?"":houseIPSegmentInforDTO.getUserName();
            content[5] = houseIPSegmentInforDTO.getUseTime()==null?"":houseIPSegmentInforDTO.getUseTime();
            content[6] = houseIPSegmentInforDTO.getAreaCode()==null?"":houseIPSegmentInforDTO.getAreaCode();
            return content;
        } else if (baseModel instanceof HouseGatewayInformationDTO){
            String[] content = new String[5];
            HouseGatewayInformationDTO houseGatewayInformation = (HouseGatewayInformationDTO)baseModel;
            content[0] = houseGatewayInformation.getHouseName()==null?"":houseGatewayInformation.getHouseName();
            content[1] = houseGatewayInformation.getLinkNo()==null?"":houseGatewayInformation.getLinkNo();
            content[2] = houseGatewayInformation.getBandWidth()==null?"":houseGatewayInformation.getBandWidth().toString();
            content[3] = houseGatewayInformation.getGatewayIP()==null?"":houseGatewayInformation.getGatewayIP();
            content[4] = houseGatewayInformation.getAreaCode()==null?"":houseGatewayInformation.getAreaCode();
            return content;
        }
        return null;
    }

    /**
     * 同步机房权限信息
     *
     * @author : songl
     * @since:2018年9月19日 下午6:38:47
     */
    private void synchroHouseAuthInfo( HttpServletRequest request) {
        AuthConstantProperty authConstantProperty = SpringUtil.getBean(AuthConstantProperty.class);
        String sycnhPath = authConstantProperty.getDataPermissionUrl()+"/"+Authority.getUserToken(request).replace("=", "%3D")+"?deployId="+authConstantProperty.getAppId();
        //获取最新的权限机房信息
        JsonObject jsonObject = SpringUtil.getPaassportHttpResult(sycnhPath, "");
        UserDetailInfo userDetailInfo = Authority.getUserDetailInfo(request);
        if(jsonObject!=null&&"1".equals(jsonObject.get("statuCode").toString())){
            JsonArray jsonArray  = jsonObject.getAsJsonArray("result");
            DataPermission dataPermission = null;
            HttpSession session = request.getSession(false);
            for(JsonElement element:jsonArray){
                dataPermission = JSON.parseObject(element.toString(), DataPermission.class);
                if(DataPermissionConstant.AUTH_HOUSE_LIST.equals(dataPermission.getDataPermissionToken())){
                    List<String> homeList = new ArrayList();
                    for(com.aotain.login.pojo.DataPermissionSetting setting:dataPermission.getSettings()){
                        homeList.add(setting.getSettingKey());
                    }
                    session.setAttribute(DataPermissionConstant.AUTH_HOUSE_LIST, homeList);

                    break;
                }
            }

        }
    }

    /**
     * 判断字符串数组是否每个元素都为null或者为空
     * @param strings
     * @return
     */
    private boolean emptyStrArray(String[] strings){
        if (strings==null){
            return true;
        }
        for (int i=0;i<strings.length;i++){
            if (!StringUtils.isEmpty(strings[i])){
                return false;
            }
        }
        return true;
    }

    /**
     * 导入机架数据
     * @param houseFrameInformationDTOList
     * @param handleNum
     * @param totalNum
     */
    private void importFrameList(List<HouseFrameInformationDTO> houseFrameInformationDTOList,AtomicLong handleNum,Long totalNum){
        List<List<HouseFrameInformationDTO>> sepList = Lists.partition(houseFrameInformationDTOList,BATCH_INSERT_NUM);
        int size = sepList==null?0:sepList.size();
        int num = size/ImportConstant.THREAD_NUM;
        int remainder = size%ImportConstant.THREAD_NUM;
        for (int i=0;i<num;i++) {
            List<List<HouseFrameInformationDTO>> oneSubmitList = Lists.newArrayList();
            List<FutureTask<List<ResultDto>>> futureTaskList = Lists.newArrayList();
            for (int j=0;j<ImportConstant.THREAD_NUM;j++){
                List<HouseFrameInformationDTO> list = sepList.get(j + ImportConstant.THREAD_NUM * i);
                FutureTask<List<ResultDto>> futureTask = HouseBatchInsertThread.importHouseFrame(list);
                oneSubmitList.add(list);
                futureTaskList.add(futureTask);
            }
            for (int j=0;j<ImportConstant.THREAD_NUM;j++){
                dealFrameThreadResult(oneSubmitList.get(j),futureTaskList.get(j),handleNum,totalNum);
            }

        }
        // 处理剩下的
        for (int i=0;i<remainder;i++){
            List<HouseFrameInformationDTO> remainList = sepList.get(size-(remainder-i));
            importRemainderFrameList(remainList,handleNum);
        }

    }

    /**
     * 处理机房机架线程处理结果
     * @param houseFrameInformationDTOList
     * @param futureTask
     * @param handleNum
     * @param totalNum
     */
    private void dealFrameThreadResult(List<HouseFrameInformationDTO> houseFrameInformationDTOList,FutureTask<List<ResultDto>> futureTask,AtomicLong handleNum,Long totalNum){
        try{
            List<ResultDto> resultDtoList = futureTask.get(10,TimeUnit.MINUTES);
            if (resultDtoList != null && !resultDtoList.isEmpty()) {
                for (int j = 0; j < resultDtoList.size(); j++) {
                    ResultDto resultDto = resultDtoList.get(j);
                    if (resultDto.getResultCode() == ResultDto.ResultCodeEnum.ERROR.getCode().intValue()) {
                        if (resultDto.getAjaxValidationResultMap() != null && !resultDto.getAjaxValidationResultMap().isEmpty()) {
                            houseFrameErrorDatas.add(new ImportErrorData(1, j, getContent(houseFrameInformationDTOList.get(j)), resultDto.getAjaxValidationResultMap().get("0").getErrorsToString().replace("[","").replace("]","")));
                        }
                    }
                }
                handleNum.addAndGet(houseFrameInformationDTOList.size());
                setPrecent(handleNum.longValue(), totalNum, getThreadContext());
            } else {
                // 线程执行未返回结果
                if (houseFrameInformationDTOList != null) {
                    for (int j = 0; j < houseFrameInformationDTOList.size(); j++) {
                        houseFrameErrorDatas.add(new ImportErrorData(1, j, getContent(houseFrameInformationDTOList.get(j)), "数据写入异常"));
                    }
                }
                handleNum.addAndGet(houseFrameInformationDTOList.size());
                setPrecent(handleNum.longValue(), totalNum, getThreadContext());
            }
        } catch (Exception e){
            logger.error("batch insert house frame fail", e);
            if (houseFrameInformationDTOList != null) {
                for (int j = 0; j < houseFrameInformationDTOList.size(); j++) {
                    houseFrameErrorDatas.add(new ImportErrorData(1, j, getContent(houseFrameInformationDTOList.get(j)), "数据写入异常"));
                }
            }
            handleNum.addAndGet(houseFrameInformationDTOList.size());
            setPrecent(handleNum.longValue(), totalNum, getThreadContext());
        }

    }

    /**
     * size = list/每批提交数据: 总共需要提交次数
     * threadTotal = size / threadNum 多线程插入处理次数
     * threadRemainder = size % threadNum 多线程处理后剩余条数
     * @param houseFrameInformationDTOList
     * @param handleNum
     */
    private void importRemainderFrameList(List<HouseFrameInformationDTO> houseFrameInformationDTOList,AtomicLong handleNum){
        if (houseFrameInformationDTOList==null||houseFrameInformationDTOList.isEmpty()){
            return;
        }
        try{
            List<ResultDto> resultDtoList = getHouseRackApi().importHouseFrame(houseFrameInformationDTOList);
            if (resultDtoList!=null && !resultDtoList.isEmpty()){
                for (int i=0;i<resultDtoList.size();i++){
                    ResultDto resultDto = resultDtoList.get(i);
                    if (resultDto.getResultCode() == ResultDto.ResultCodeEnum.ERROR.getCode().intValue()) {
                        houseFrameErrorDatas.add(new ImportErrorData(0, i, getContent(houseFrameInformationDTOList.get(i)), resultDto.getAjaxValidationResultMap().get("0").getErrorsToString().replace("[","").replace("]","")));
                    }
                }
            }
            handleNum.addAndGet(houseFrameInformationDTOList.size());
        } catch (Exception e){
            logger.info("batch insert house frame fail",e);
            if (houseFrameInformationDTOList!=null){
                for (int j=0;j<houseFrameInformationDTOList.size();j++){
                    houseFrameErrorDatas.add(new ImportErrorData(3, j, getContent(houseFrameInformationDTOList.get(j)), "数据写入异常"));
                }
            }
            handleNum.addAndGet(houseFrameInformationDTOList.size());
        }

    }


    /**
     * 导入ip地址段数据
     * @param houseIPSegmentInforDTOList
     * @param handleNum
     * @param totalNum
     */
    private void importIpList(List<HouseIPSegmentInforDTO> houseIPSegmentInforDTOList,AtomicLong handleNum,Long totalNum){
        List<List<HouseIPSegmentInforDTO>> sepList = Lists.partition(houseIPSegmentInforDTOList,BATCH_INSERT_NUM);
        int size = sepList==null?0:sepList.size();
        int num = size/ImportConstant.THREAD_NUM;
        int remainder = size%ImportConstant.THREAD_NUM;
        for (int i=0;i<num;i++) {
            List<List<HouseIPSegmentInforDTO>> oneSubmitList = Lists.newArrayList();
            List<FutureTask<List<ResultDto>>> futureTaskList = Lists.newArrayList();
            for (int j=0;j<ImportConstant.THREAD_NUM;j++){
                List<HouseIPSegmentInforDTO> list = sepList.get(j + ImportConstant.THREAD_NUM * i);
                FutureTask<List<ResultDto>> futureTask = HouseBatchInsertThread.importHouseIp(list);
                oneSubmitList.add(list);
                futureTaskList.add(futureTask);
            }

            for (int j=0;j<ImportConstant.THREAD_NUM;j++){
                dealIpThreadResult(oneSubmitList.get(j),futureTaskList.get(j),handleNum,totalNum);
            }

        }
        // 处理剩下的
        for (int i=0;i<remainder;i++){
            List<HouseIPSegmentInforDTO> remainList = sepList.get(size-(remainder-i));
            importRemainderIpList(remainList,handleNum);
        }
        // 处理剩下的
//        if (size>0){
//            if (remainder==1){
//                List<HouseIPSegmentInforDTO> remainderList1 = sepList.get(size-1);
//                importRemainderIpList(remainderList1,handleNum);
//            } else if (remainder==2){
//                List<HouseIPSegmentInforDTO> remainderList1 = sepList.get(size-2);
//                List<HouseIPSegmentInforDTO> remainderList2 = sepList.get(size-1);
//                importRemainderIpList(remainderList1,handleNum);
//                importRemainderIpList(remainderList2,handleNum);
//            } else if (remainder==3){
//                List<HouseIPSegmentInforDTO> remainderList1 = sepList.get(size-3);
//                List<HouseIPSegmentInforDTO> remainderList2 = sepList.get(size-2);
//                List<HouseIPSegmentInforDTO> remainderList3 = sepList.get(size-1);
//                importRemainderIpList(remainderList1,handleNum);
//                importRemainderIpList(remainderList2,handleNum);
//                importRemainderIpList(remainderList3,handleNum);
//            }
//        }
    }

    /**
     * 处理机房ip线程结果
     * @param houseIPSegmentInforDTOList
     * @param futureTask
     * @param handleNum
     * @param totalNum
     */
    private void dealIpThreadResult(List<HouseIPSegmentInforDTO> houseIPSegmentInforDTOList,FutureTask<List<ResultDto>> futureTask,AtomicLong handleNum,Long totalNum){
        try{
            List<ResultDto> resultDtoList = futureTask.get(10,TimeUnit.MINUTES);
            if (resultDtoList != null && !resultDtoList.isEmpty()) {
                for (int j = 0; j < resultDtoList.size(); j++) {
                    ResultDto resultDto = resultDtoList.get(j);
                    if (resultDto.getResultCode() == ResultDto.ResultCodeEnum.ERROR.getCode().intValue()) {
                        if (resultDto.getAjaxValidationResultMap() != null && !resultDto.getAjaxValidationResultMap().isEmpty()) {
                            houseIpSegErrorDatas.add(new ImportErrorData(1, j, getContent(houseIPSegmentInforDTOList.get(j)), resultDto.getAjaxValidationResultMap().get("0").getErrorsToString().replace("[","").replace("]","")));
                        }
                    }
                }
                handleNum.addAndGet(houseIPSegmentInforDTOList.size());
                setPrecent(handleNum.longValue(), totalNum, getThreadContext());
            } else {
                // 线程执行未返回结果
                if (houseIPSegmentInforDTOList != null) {
                    for (int j = 0; j < houseIPSegmentInforDTOList.size(); j++) {
                        houseIpSegErrorDatas.add(new ImportErrorData(1, j, getContent(houseIPSegmentInforDTOList.get(j)), "数据写入异常"));
                    }
                }
                handleNum.addAndGet(houseIPSegmentInforDTOList.size());
                setPrecent(handleNum.longValue(), totalNum, getThreadContext());
            }
        } catch (Exception e){
            logger.error("batch insert house ip fail", e);
            if (houseIPSegmentInforDTOList != null) {
                for (int j = 0; j < houseIPSegmentInforDTOList.size(); j++) {
                    houseIpSegErrorDatas.add(new ImportErrorData(1, j, getContent(houseIPSegmentInforDTOList.get(j)), "数据写入异常"));
                }
            }
            handleNum.addAndGet(houseIPSegmentInforDTOList.size());
            setPrecent(handleNum.longValue(), totalNum, getThreadContext());
        }

    }

    /**
     * size = list/每批提交数据: 总共需要提交次数
     * threadTotal = size / threadNum 多线程插入处理次数
     * threadRemainder = size % threadNum 多线程处理后剩余条数
     * @param houseIPSegmentInforDTOList
     * @param handleNum
     */
    private void importRemainderIpList(List<HouseIPSegmentInforDTO> houseIPSegmentInforDTOList,AtomicLong handleNum){
        if (houseIPSegmentInforDTOList==null||houseIPSegmentInforDTOList.isEmpty()){
            return;
        }
        try{
            List<ResultDto> resultDtoList = getHouseIpSegApi().importHouseIpSeg(houseIPSegmentInforDTOList);
            if (resultDtoList!=null && !resultDtoList.isEmpty()){
                for (int i=0;i<resultDtoList.size();i++){
                    ResultDto resultDto = resultDtoList.get(i);
                    if (resultDto.getResultCode() == ResultDto.ResultCodeEnum.ERROR.getCode().intValue()) {
                        houseIpSegErrorDatas.add(new ImportErrorData(0, i, getContent(houseIPSegmentInforDTOList.get(i)), resultDto.getAjaxValidationResultMap().get("0").getErrorsToString().replace("[","").replace("]","")));
                    }
                }
            }
        } catch (Exception e){
            logger.info("batch insert house ip fail",e);
            if (houseIPSegmentInforDTOList!=null){
                for (int j=0;j<houseIPSegmentInforDTOList.size();j++){
                    houseIpSegErrorDatas.add(new ImportErrorData(3, j, getContent(houseIPSegmentInforDTOList.get(j)), "数据写入异常"));
                }
            }
            handleNum.addAndGet(houseIPSegmentInforDTOList.size());
        }

    }

    /**
     * 获取值的字符长度，中文为两个字符长度。
     *
     * @param value 需要计算的字符串
     * @return
     */
    public static int getValueCharLength(String value) {
        if (value == null) {
            return 0;
        }
        char[] chars = value.toCharArray();
        int length = 0;
        for (int index = 0; index < chars.length; index++) {
            if (isUnicode(chars[index])) {
                length += 3;
            } else {
                length++;
            }
        }
        return length;
    }

    /**
     * 是否unicode，判断是否为汉字
     *
     * @param c 需要校验的字符
     * @return
     */
    private static boolean isUnicode(char c) {
        if((c >= 0x4e00)&&(c <= 0x9fbb)) {
            return true;
        }
        return false;
    }

    public static void main(String[] args) {
        String[] a = new String[]{null,""};
//        System.out.println(emptyStrArray(a));
        System.out.println("[[\"\"]".replace("\"",""));
    }
}
