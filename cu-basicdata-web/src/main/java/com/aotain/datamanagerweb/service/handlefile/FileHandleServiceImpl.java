package com.aotain.datamanagerweb.service.handlefile;


import com.aotain.cu.serviceapi.dto.HouseInformationDTO;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.dto.UserInformationDTO;
import com.aotain.cu.serviceapi.model.ImportTaskModel;
import com.aotain.datamanagerweb.cache.CommonCache;
import com.aotain.datamanagerweb.constant.HouseImportTaskModel;
import com.aotain.datamanagerweb.constant.ImportConstant;
import com.aotain.datamanagerweb.dto.dic.BaseCode;
import com.aotain.datamanagerweb.dto.dic.BaseCodeDataDto;
import com.aotain.datamanagerweb.mapper.export.HouseExportMapper;
import com.aotain.datamanagerweb.mapper.export.RptUserInfoExportMapper;
import com.aotain.datamanagerweb.mapper.export.UserInfoExportMapper;
import com.aotain.datamanagerweb.mapper.task.ImportTaskMapper;
import com.aotain.datamanagerweb.model.FileImportResult;
import com.aotain.datamanagerweb.model.SelectInfoBean;
import com.aotain.datamanagerweb.model.dataexport.UserHhInforExport;
import com.aotain.datamanagerweb.model.dataexport.UserInforExport;
import com.aotain.datamanagerweb.model.dataexport.UserServiceInforExport;
import com.aotain.datamanagerweb.model.dataexport.UserVirtualExport;
import com.aotain.datamanagerweb.model.dataexport.house.ExportGatewayInformation;
import com.aotain.datamanagerweb.model.dataexport.house.ExportHouseFrameInformation;
import com.aotain.datamanagerweb.model.dataexport.house.ExportHouseInformation;
import com.aotain.datamanagerweb.model.dataexport.house.ExportIpSegmentInformation;
import com.aotain.datamanagerweb.service.BaseService;
import com.aotain.datamanagerweb.service.CommonService;
import com.aotain.datamanagerweb.utils.FileTools;
import com.aotain.datamanagerweb.utils.HostUtil;
import com.aotain.datamanagerweb.utils.thread.HandleHouseFileThread;
import com.aotain.datamanagerweb.utils.thread.HandleIdcFileThread;
import com.aotain.datamanagerweb.utils.thread.HandleUserFileThread;
import com.aotain.datamanagerweb.utils.thread.ThreadContext;
import com.aotain.login.support.Authority;
import com.google.common.collect.Lists;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service("fileHandleService")
public class FileHandleServiceImpl extends BaseService implements FileHandleService ,InitializingBean{

    private Logger logger = LoggerFactory.getLogger(FileHandleServiceImpl.class);

    @Autowired
    private ImportTaskMapper importTaskMapper;

    @Autowired
    private UserInfoExportMapper userInfoExportMapper;

    @Autowired
    private HouseExportMapper houseExportMapper;

    @Autowired
    private ThreadContext context;

    @Autowired
    private CommonCache commonCache;

    @Autowired
    private CommonService commonService;

    @Autowired
    private RptUserInfoExportMapper rptUserInfoExportMapper;

    private static Map<Long,Thread> threadMap = new HashMap<Long,Thread>();
    private static Map<String,Map<Integer,String>> dicMap = new HashMap<String,Map<Integer,String>>();

    @Override
    public void exportTemplate( HttpServletRequest request, HttpServletResponse response, String fileName,String exportName) {
        FileTools.exportTemplete(request,response,fileName,exportName);
    }

    @Override
    public ResultDto handUserImport( HttpServletRequest request, ImportTaskModel model ) {

            model.setTaskType(ImportConstant.TaskTypeEum.USER.getType());
            String fileName= setImportTask(request,model);
            if (StringUtils.isEmpty(fileName)){
                return getErrorResult("已经有导入任务... ... 稍后再试");
            }
            Thread thread = new HandleUserFileThread(fileName,"user",model.getTaskId(),model);
            thread.start();
            threadMap.put(model.getTaskId(),thread);
            return getSuccessResult("导入中... ...");
    }

    @Override
    public ResultDto handHouseImport( HttpServletRequest request, HouseImportTaskModel model ) {
        model.setTaskType(ImportConstant.TaskTypeEum.HOUSE.getType());
        model.setHttpServletRequest(request);
        String fileName= setImportTask(request,model);
        if (StringUtils.isEmpty(fileName)){
            return getErrorResult("已经有导入任务... ... 稍后再试");
        }
        Thread thread = new HandleHouseFileThread(fileName,"user",model.getTaskId(),model);
        thread.start();
        threadMap.put(model.getTaskId(),thread);
        return getSuccessResult("导入中... ...");
    }

    @Override
    public FileImportResult getImportProcess( Long userId,Integer type ) {
        Map<String,Object> paramMap = new HashMap<>();
        paramMap.put("userId",userId);
        paramMap.put("type",type);
        ImportTaskModel model = importTaskMapper.selectByUserId(paramMap);
        if (model!=null) {
            if (model.getStatus().intValue() == ImportConstant.StatusEum.IMPORTING.getType().intValue()) {
                Thread thread = threadMap.get(model.getTaskId());
                if (thread!=null){
                    String res = context.get(thread, "status");
                    if ("undone".equals(res)){
                        ImportTaskModel param =new ImportTaskModel();
                        param.setStatus(ImportConstant.StatusEum.IMPORT_FAIL.getType());
                        param.setTaskId(model.getTaskId());
                        importTaskMapper.update(param);
                        logger.error("could not undone the import thread , task is "+model.getTaskId());
                        return getImportError();
                    }
                    String per = context.get(thread, "importPercent");
                    return getImportingResult(per);
                }else {
                    //已经找不到线程
                    String currentHost = HostUtil.getLocalHost();
                    String threadHost = model.getServerIp();
                    if (currentHost.equals(threadHost)) {
                        ImportTaskModel param = new ImportTaskModel();
                        param.setStatus(ImportConstant.StatusEum.IMPORT_FAIL.getType());
                        param.setTaskId(model.getTaskId());
                        importTaskMapper.update(param);
                        logger.error("could not find the thread , task id is " + model.getTaskId());
                        return getImportError();
                    }else {
                        getImportingResult("0");
                    }
                }
            } else {
                Thread thread = threadMap.get(model.getTaskId());
                if (thread != null) {
                    context.remove(thread);
                    threadMap.remove(thread);
                }
                if (model.getStatus().intValue() == ImportConstant.StatusEum.IMPORT_SUCCESS.getType().intValue()) {
                    return getImportSucResult(model.getErrorFileName());
                } else {
                    return getImportError();
                }
            }
        }
        return new FileImportResult();
    }

    @Override
    public void exportUserErrorFile( HttpServletRequest request, HttpServletResponse response, String fileName ) {
        FileTools.exportErrorFile(request,response,fileName,"user");
    }

    @Override
    public void exportIspErrorFile( HttpServletRequest request, HttpServletResponse response, String fileName ) {
        FileTools.exportErrorFile(request,response,fileName,"isp");
    }

    @Override
    public void exportHouseErrorFile( HttpServletRequest request, HttpServletResponse response, String fileName ) {
        FileTools.exportErrorFile(request,response,fileName,"house");
    }

    @Override
    public void exportUserData( HttpServletRequest request ,HttpServletResponse response, UserInformationDTO dto) {
        List<UserInforExport> list = new ArrayList<>();
        boolean isEmpty = StringUtils.isEmpty(dto.getAreaCodes())
                ||StringUtils.isEmpty(dto.getAuthIdentities());
        //分权分域数据过滤
        if (!dto.getAuthFilter() && !isEmpty){
            list = userInfoExportMapper.getExportData(dto);
        }
        List<UserServiceInforExport> serviceList = new ArrayList<UserServiceInforExport>();
        List<UserHhInforExport> bandList = new ArrayList<UserHhInforExport>();
        List<UserVirtualExport> virList = new ArrayList<UserVirtualExport>();
        if (list.size()>0){
            for (UserInforExport user:list){
                if (user.getServiceList()!=null) { serviceList.addAll(user.getServiceList());
                }
                if (user.getBandwidthList()!=null) bandList.addAll(user.getBandwidthList());
                if (user.getVirtualList()!=null) virList.addAll(user.getVirtualList());
            }
        }
        List<List<?>> exportList = new ArrayList<List<?>>();
        List<Class<?>> classlist = new ArrayList<Class<?>>();
        reBuildMainList(list);
        reBuildServiceList(serviceList);
        reBuildBandList(bandList);
        reBuildVirtualList(virList);

        exportList.add(list);
        exportList.add(serviceList);
        exportList.add(bandList);
        exportList.add(virList);
        classlist.add(UserInforExport.class);
        classlist.add(UserServiceInforExport.class);
        classlist.add(UserHhInforExport.class);
        classlist.add(UserVirtualExport.class);

        FileTools.exportDataWithtemplate(request,response,exportList,classlist,"用户预录入信息","userInformationTemplate");
    }

    @Override
    public void exportHouseData( HttpServletRequest request ,HttpServletResponse response, HouseInformationDTO dto) {
        List<ExportHouseInformation> list = new ArrayList<>();
        boolean isEmpty = dto.getUserAuthHouseList().isEmpty()
                ||dto.getUserAuthIdentityList().isEmpty();
        //分权分域数据过滤
        if (!dto.getAuthFilter() && !isEmpty){
            list = houseExportMapper.getExportData(dto);
        }
        List<ExportIpSegmentInformation> ipSegList = Lists.newArrayList();
        List<ExportHouseFrameInformation> frameList = Lists.newArrayList();
        List<ExportGatewayInformation> gatewayInfoList = Lists.newArrayList();
        if (list.size()>0){
            for (ExportHouseInformation exportHouseInformation:list){
                if (exportHouseInformation.getIpSegList()!=null){
                    // 只导出满足条件的数据
                    for (int i=0;i<exportHouseInformation.getIpSegList().size();i++){
                        ExportIpSegmentInformation exportIpSegmentInformation = exportHouseInformation.getIpSegList().get(i);
                        if (dto.getAreaCodes().contains(exportIpSegmentInformation.getAreaCode().split("-")[0])){
                            ipSegList.add(exportIpSegmentInformation);
                        }
                    }
                }

                if (exportHouseInformation.getFrameList()!=null) {
                    for (int i=0;i<exportHouseInformation.getFrameList().size();i++){
                        ExportHouseFrameInformation exportHouseFrameInformation = exportHouseInformation.getFrameList().get(i);
                        if (dto.getAreaCodes().contains(exportHouseFrameInformation.getAreaCode().split("-")[0])){
                            frameList.add(exportHouseFrameInformation);
                        }
                    }
                }

                if (exportHouseInformation.getGatewayInfoList()!=null) {
                    for (int i=0;i<exportHouseInformation.getGatewayInfoList().size();i++){
                        ExportGatewayInformation exportGatewayInformation = exportHouseInformation.getGatewayInfoList().get(i);
                        if (dto.getAreaCodes().contains(exportGatewayInformation.getAreaCode().split("-")[0])){
                            gatewayInfoList.add(exportGatewayInformation);
                        }
                    }
                }
            }
        }
        List<List<?>> exportList = new ArrayList<List<?>>();
        List<Class<?>> classList = new ArrayList<Class<?>>();

        exportList.add(list);
        exportList.add(ipSegList);
        exportList.add(frameList);
        exportList.add(gatewayInfoList);
        classList.add(ExportHouseInformation.class);
        classList.add(ExportIpSegmentInformation.class);
        classList.add(ExportHouseFrameInformation.class);
        classList.add(ExportGatewayInformation.class);
        FileTools.exportDataWithtemplate(request,response,exportList,classList,"机房预录入信息","houseInformationTemplate");
    }

    @Override
    public void exportRptHouseData( HttpServletRequest request ,HttpServletResponse response, HouseInformationDTO dto) {
        List<ExportHouseInformation> list = new ArrayList<>();
        boolean isEmpty = dto.getUserAuthHouseList().isEmpty()
                ||dto.getUserAuthIdentityList().isEmpty();
        //分权分域数据过滤
        if (!dto.getAuthFilter() && !isEmpty){
            list = houseExportMapper.getExportDataRpt(dto);
        }
        List<ExportIpSegmentInformation> ipSegList = Lists.newArrayList();
        List<ExportHouseFrameInformation> frameList = Lists.newArrayList();
        List<ExportGatewayInformation> gatewayInfoList = Lists.newArrayList();
        if (list.size()>0){
            for (ExportHouseInformation exportHouseInformation:list){
                if (exportHouseInformation.getIpSegList()!=null){
                    // 只导出满足条件的数据
                    for (int i=0;i<exportHouseInformation.getIpSegList().size();i++){
                        ExportIpSegmentInformation exportIpSegmentInformation = exportHouseInformation.getIpSegList().get(i);
                        if (dto.getAreaCodes().contains(exportIpSegmentInformation.getAreaCode().split("-")[0])){
                            ipSegList.add(exportIpSegmentInformation);
                        }
                    }
//                    ipSegList.addAll(exportHouseInformation.getIpSegList());
                }

                if (exportHouseInformation.getFrameList()!=null) {
                    for (int i=0;i<exportHouseInformation.getFrameList().size();i++){
                        ExportHouseFrameInformation exportHouseFrameInformation = exportHouseInformation.getFrameList().get(i);
                        if (dto.getAreaCodes().contains(exportHouseFrameInformation.getAreaCode().split("-")[0])){
                            frameList.add(exportHouseFrameInformation);
                        }
                    }
//                    frameList.addAll(exportHouseInformation.getFrameList());
                }

                if (exportHouseInformation.getGatewayInfoList()!=null) {
                    for (int i=0;i<exportHouseInformation.getGatewayInfoList().size();i++){
                        ExportGatewayInformation exportGatewayInformation = exportHouseInformation.getGatewayInfoList().get(i);
                        if (dto.getAreaCodes().contains(exportGatewayInformation.getAreaCode().split("-")[0])){
                            gatewayInfoList.add(exportGatewayInformation);
                        }
                    }
//                    gatewayInfoList.addAll(exportHouseInformation.getGatewayInfoList());
                }

            }
        }
        List<List<?>> exportList = new ArrayList<List<?>>();
        List<Class<?>> classList = new ArrayList<Class<?>>();
        exportList.add(list);
        exportList.add(ipSegList);
        exportList.add(frameList);
        exportList.add(gatewayInfoList);
        classList.add(ExportHouseInformation.class);
        classList.add(ExportIpSegmentInformation.class);
        classList.add(ExportHouseFrameInformation.class);
        classList.add(ExportGatewayInformation.class);
        FileTools.exportDataWithtemplate(request,response,exportList,classList,"机房上报信息","houseInformationTemplate");
    }

    @Override
    public void exportRptUserData(HttpServletRequest request, HttpServletResponse response, UserInformationDTO dto) {
        List<UserInforExport> list = new ArrayList<>();
        boolean isEmpty = StringUtils.isEmpty(dto.getAreaCodes())
                || StringUtils.isEmpty(dto.getAuthIdentities());
        //分权分域数据过滤
        if (!dto.getAuthFilter() && !isEmpty){
            list = rptUserInfoExportMapper.getExportData(dto);
        }
        List<UserServiceInforExport> serviceList = new ArrayList<UserServiceInforExport>();
        List<UserHhInforExport> bandList = new ArrayList<UserHhInforExport>();
        List<UserVirtualExport> virList = new ArrayList<UserVirtualExport>();
        if (list.size()>0){
            for (UserInforExport user:list){
                if (user.getServiceList()!=null) {
                    user.getServiceList().forEach(service->{
                        List<String> domains = service.getDomains();
                        if (domains!=null && !domains.isEmpty()) {
                            StringBuilder sb = new StringBuilder();
                            for (String domain : domains) {
                                sb.append(domain).append(",");
                            }
                            service.setDomainName(sb.substring(0, sb.length() - 1));
                        }
                    });
                    serviceList.addAll(user.getServiceList());
                }
                if (user.getBandwidthList()!=null) bandList.addAll(user.getBandwidthList());
                if (user.getVirtualList()!=null) virList.addAll(user.getVirtualList());
            }
        }
        List<List<?>> exportList = new ArrayList<List<?>>();
        List<Class<?>> classlist = new ArrayList<Class<?>>();
        /*reBuildMainList(list);
        reBuildServiceList(serviceList);
        reBuildBandList(bandList);
        reBuildVirtualList(virList);*/
        exportList.add(list);
        exportList.add(serviceList);
        exportList.add(bandList);
        exportList.add(virList);
        classlist.add(UserInforExport.class);
        classlist.add(UserServiceInforExport.class);
        classlist.add(UserHhInforExport.class);
        classlist.add(UserVirtualExport.class);
        FileTools.exportDataWithtemplate(request,response,exportList,classlist,"用户上报信息","userInformationTemplate");
    }

    private String setImportTask(HttpServletRequest request,ImportTaskModel model ){
        if (importTaskMapper.isImporting(model)>0){
            return null;
        }
        String fileName = FileTools.saveFile(request,"importFile","user");
        if (model.getTaskType()==0){
            model.setTaskType(ImportConstant.TaskTypeEum.USER.getType());
        }
        model.setFileName(fileName);
        model.setStatus(ImportConstant.StatusEum.IMPORTING.getType().intValue());
        model.setServerIp(HostUtil.getLocalHost());
        importTaskMapper.insert(model);
        return fileName;
    }

    @Override
    public void exportIdcErrorFile(HttpServletRequest request, HttpServletResponse response, String fileName) {
        FileTools.exportErrorFile(request,response,fileName,"jyz");
    }

    @Override
    public ResultDto handIdcImport(HttpServletRequest request, ImportTaskModel model) {
//        if (importTaskMapper.isImporting(model)>0){
//            return null;
//        }
        String fileName = FileTools.saveFile(request,"importFile","jyz");
        Integer userId=Authority.getUserDetailInfo(request).getUserId();
        model.setCreateUserId(Long.valueOf(userId));
        model.setTaskType(ImportConstant.TaskTypeEum.JYZ.getType());
        model.setFileName(fileName);
        model.setStatus(ImportConstant.StatusEum.IMPORTING.getType());
        model.setServerIp(HostUtil.getLocalHost());
        importTaskMapper.insert(model);

        if (StringUtils.isEmpty(fileName)){
            return getErrorResult("已经有导入任务... ... 稍后再试");
        }
        Thread thread = new HandleIdcFileThread(fileName,"jyz",model.getTaskId(),model);
        thread.start();
        threadMap.put(model.getTaskId(),thread);
        return getSuccessResult("导入中... ...");
    }


    private void reBuildMainList( List<UserInforExport> list){
        if (list!=null && !list.isEmpty()){
            list.forEach(userInforExport -> {
                userInforExport.setNature(reConstructValue(userInforExport.getNature(),"yhsx"));
                userInforExport.setIdentify(reConstructValue(userInforExport.getIdentify(),"yhbs"));
                userInforExport.setUnitNature(reConstructValue(userInforExport.getUnitNature(),"dwsx"));
                userInforExport.setIdType(reConstructValue(userInforExport.getIdType(),"zjlx"));
                userInforExport.setOfficerIdType(reConstructValue(userInforExport.getOfficerIdType(),"zjlx"));
                userInforExport.setAreaCodeStr(reConstructValue(userInforExport.getAreaCodeStr(),"lsdw"));
            });
        }
    }
    private void reBuildServiceList( List<UserServiceInforExport> list){
        if (list!=null && !list.isEmpty()){
            list.forEach(service -> {
                service.setServiceContent(reConstructValue(service.getServiceContent(),"fwnr"));
                service.setBusiness(reConstructValue(service.getBusiness(),"ywlx"));
                service.setRegType(reConstructValue(service.getRegType(),"balx"));
                service.setSetMode(reConstructValue(service.getSetMode(),"jrfs"));
                service.setAreaCodeStr(reConstructValue(service.getAreaCodeStr(),"lsdw"));

                List<String> domains = service.getDomains();
                if (domains!=null && !domains.isEmpty()) {
                    StringBuilder sb = new StringBuilder();
                    for (String domain : domains) {
                        sb.append(domain).append(",");
                    }
                    service.setDomainName(sb.substring(0, sb.length() - 1));
                }
            });
        }
    }
    private void reBuildBandList( List<UserHhInforExport> list){
        if (list!=null && !list.isEmpty()){
            list.forEach(h -> {
                h.setAreaCodeStr(reConstructValue(h.getAreaCodeStr(),"lsdw"));
            });
        }
    }
    private void reBuildVirtualList( List<UserVirtualExport> list){
        if (list!=null && !list.isEmpty()){
            list.forEach(v -> {
                v.setVirtualState(reConstructValue(v.getVirtualState(),"xnzjzt"));
                v.setVirtualType(reConstructValue(v.getVirtualType(),"xnzjlx"));
                v.setAreaCodeStr(reConstructValue(v.getAreaCodeStr(),"lsdw"));
            });
        }
    }

    private String reConstructValue(String value ,String type){
        if (!StringUtils.isEmpty(value)){
            StringBuilder sb = new StringBuilder();
            String[] valus = value.split(",");
            for (String s : valus) {
                try {
                    String desc = (dicMap.get(type)).get(Integer.parseInt(s));
                    if (!StringUtils.isEmpty(desc)){
                        sb.append(s+"-"+desc).append(",");
                    }else {
                        sb.append(s).append(",");
                    }
                }catch (Exception e){
                    logger.error("reconstruct user export data error ",e);
                    sb.append(s).append(",");
                }

            }
            return sb.substring(0,sb.length()-1);
        }
        return "";
    }
    @Override
    public void afterPropertiesSet() throws Exception {
        buildDicCache();
    }

    private void buildDicCache(){
        BaseCodeDataDto dataDto=null;
        try {
            dataDto = commonCache.getBaseCodeDataCache().get("");
        } catch (ExecutionException e) {
            logger.error("get base code error",e);
        }
        Map<Integer,String> yhsxMap = new HashMap<>();
        yhsxMap.put(1,"提供互联网应用服务的用户");
        yhsxMap.put(2,"其他用户");
        dicMap.put("yhsx",yhsxMap);//用户属性

        Map<Integer,String> ywlxMap = new HashMap<>();
        ywlxMap.put(1,"IDC业务");
        ywlxMap.put(2,"ISP业务");
        dicMap.put("ywlx",ywlxMap);//业务类型

        Map<Integer,String> xnzjzt = new HashMap<>();
        xnzjzt.put(1,"运行");
        xnzjzt.put(2,"挂起");
        xnzjzt.put(2,"关机");
        dicMap.put("xnzjzt",xnzjzt);//虚拟主机状态

        Map<Integer,String> xnzjlx = new HashMap<>();
        xnzjlx.put(1,"共享式");
        xnzjlx.put(2,"专用式");
        xnzjlx.put(3,"云虚拟");
        dicMap.put("xnzjlx",xnzjlx);//虚拟主机类型

        if (dataDto!=null){
            List<BaseCode> yhbsArr = dataDto.getYhbsArr();
            if (yhbsArr!=null && !yhbsArr.isEmpty()){
                Map<Integer,String> yhbsMap = new HashMap<>();
                yhbsArr.forEach(baseCode -> {
                    yhbsMap.put(Integer.parseInt(baseCode.getId()),baseCode.getMc());
                });
                dicMap.put("yhbs",yhbsMap);//用户标识
            }

            List<BaseCode> dwsxArr = dataDto.getDwsxArr();
            if (dwsxArr!=null && !dwsxArr.isEmpty()){
                Map<Integer,String> dwsxMap = new HashMap<>();
                dwsxArr.forEach(baseCode -> {
                    dwsxMap.put(Integer.parseInt(baseCode.getId()),baseCode.getMc());
                });
                dicMap.put("dwsx",dwsxMap);//单位属性
            }

            List<BaseCode> zjlxArr = dataDto.getZjlxArr();
            if (zjlxArr!=null && !zjlxArr.isEmpty()){
                Map<Integer,String> zjlxMap = new HashMap<>();
                zjlxArr.forEach(baseCode -> {
                    zjlxMap.put(Integer.parseInt(baseCode.getId()),baseCode.getMc());
                });
                dicMap.put("zjlx",zjlxMap);//证件类型
            }

            List<BaseCode> fwnrArr = dataDto.getFwnrArr();
            if (fwnrArr!=null && !fwnrArr.isEmpty()){
                Map<Integer,String> fwnrMap = new HashMap<>();
                fwnrArr.forEach(baseCode -> {
                    fwnrMap.put(Integer.parseInt(baseCode.getId()),baseCode.getMc());
                });
                dicMap.put("fwnr",fwnrMap);//服务内容
            }
            List<BaseCode> balxArr = dataDto.getBalxArr();
            if (balxArr!=null && !balxArr.isEmpty()){
                Map<Integer,String> balxMap = new HashMap<>();
                balxArr.forEach(baseCode -> {
                    balxMap.put(Integer.parseInt(baseCode.getId()),baseCode.getMc());
                });
                dicMap.put("balx",balxMap);//备案类型
            }

            List<BaseCode> jrfsArr = dataDto.getJrfsArr();
            if (jrfsArr!=null && !jrfsArr.isEmpty()){
                Map<Integer,String> jrfsMap = new HashMap<>();
                jrfsArr.forEach(baseCode -> {
                    jrfsMap.put(Integer.parseInt(baseCode.getId()),baseCode.getMc());
                });
                dicMap.put("jrfs",jrfsMap);//接入方式
            }
        }

        List<SelectInfoBean> area = commonService.getSubOrdArea();
        if (area!=null && !area.isEmpty()){
            Map<Integer,String> areaMap = new HashMap<>();
            area.forEach(value->{
                areaMap.put(Integer.parseInt(value.getValue()),value.getTitle());
            });
            dicMap.put("lsdw",areaMap);//隶属单位
        }

    }
}
