package com.aotain.datamanagerweb.controller.idc;

import com.aotain.common.config.redis.BaseRedisService;
import com.aotain.cu.serviceapi.dto.AjaxValidationResult;
import com.aotain.cu.serviceapi.dto.ApproveResultDto;
import com.aotain.cu.serviceapi.dto.IDCInformationDTO;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.IdcInformation;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.datamanagerweb.annotation.RequiresPermission;
import com.aotain.datamanagerweb.controller.CommonHandlerController;
import com.aotain.datamanagerweb.service.system.SystemLogManageService;
import com.aotain.datamanagerweb.serviceapi.PreIdcInfoApi;
import com.aotain.datamanagerweb.annotation.LogAction;
import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.datamanagerweb.utils.FileTools;
import com.aotain.datamanagerweb.utils.constant.RedisKeyConstant;
import com.aotain.login.support.Authority;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Controller
public class IdcInfoController extends CommonHandlerController {

    private Logger log = LoggerFactory.getLogger(IdcInfoController.class);
    
    private static final String MODULE_NAME = "经营者";
    
    @Autowired
    private PreIdcInfoApi preIdcInfoApi;

    @Autowired
    private SystemLogManageService systemLogManageService;


    @Autowired
    private BaseRedisService baseRedisService;

    @RequestMapping(value ="/idc/index")
    public ModelAndView index() {
        ModelAndView mav = new ModelAndView("/idc/index");
        return mav;
    }

    @RequestMapping(value ="/serviceapi/pre/idcinfo/listIdcInfo", method = {  RequestMethod.POST })
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.READ)
    public PageResult<IdcInformation> listIdcInfo() {
        return preIdcInfoApi.listIdcInfo();
    }

    @RequestMapping(value ="/serviceapi/pre/idcinfo/checkIdcExsist", method = {  RequestMethod.POST })
    @ResponseBody
    public boolean checkIdcExsist() {
        return preIdcInfoApi.checkIdcExsist();
    }

    @RequestMapping(value ="/serviceapi/pre/idcinfo/insert", method = {  RequestMethod.POST })
    @ResponseBody
    @RequiresPermission(value = "ROLE_IDC_ADD")
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.CREATE)
    public ResultDto insert(IdcInformation idcInformation, HttpServletRequest request){
        Integer userId=Authority.getUserDetailInfo(request).getUserId();
        idcInformation.setCreateUserId(userId);
        idcInformation.setUpdateUserId(userId);
        ResultDto aa=preIdcInfoApi.insert(idcInformation);
        Integer jyzId=aa.getPid();
        if(aa.getResultCode()==0){
            try{
                idcInformation.setJyzId(jyzId);
                systemLogManageService.dataLog(idcInformation, "jyzId", SystemActionLogType.CREATE, "经营者", jyzId.longValue());
            }catch (Exception e){
                log.error("add idc write log fail "+e.toString());
            }
            aa =  preIdcInfoApi.preValidate(aa.getPid());
            return aa;
        }else{
            return aa;
        }
    }

    @RequestMapping(value ="/serviceapi/pre/idcinfo/update", method = {  RequestMethod.POST })
    @ResponseBody
    @RequiresPermission(value = "ROLE_IDC_UPDATE")
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.UPDATE)
    public ResultDto update(IdcInformation idcInformation, HttpServletRequest request){
        Integer userId=Authority.getUserDetailInfo(request).getUserId();
        idcInformation.setUpdateUserId(userId);
        ResultDto re=preIdcInfoApi.update(idcInformation);
        if(re.getResultCode()==0){
            re=preIdcInfoApi.preValidate(idcInformation.getJyzId());
        }
        if(re.getResultCode()==0){
            systemLogManageService.dataLog(idcInformation, "jyzId", SystemActionLogType.UPDATE, "经营者", idcInformation.getJyzId().longValue());
        }
        return re;
    }

    @RequestMapping(value ="/serviceapi/pre/idcinfo/delete", method = {  RequestMethod.POST })
    @ResponseBody
    @RequiresPermission(value = "ROLE_IDC_DELETE")
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.DELETE)
    public ResultDto delete(Integer jyzId, HttpServletRequest request){
        ResultDto re=preIdcInfoApi.delete(jyzId);
//        if(re.getResultCode()==0){
//            re=preIdcInfoApi.preValidate(jyzId);
//        }
        if(re.getResultCode()==0){
            systemLogManageService.dataLog("jyzId", SystemActionLogType.DELETE, "经营者", jyzId.toString());
        }
        return re;
    }

    @RequestMapping(value ="/serviceapi/pre/idcinfo/revokeValid", method = {  RequestMethod.POST })
    @ResponseBody
    @RequiresPermission(value = "ROLE_IDC_REVOKE")
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.CREATE)
    public ResultDto revokeValid(Integer jyzId){
    	ResultDto result = preIdcInfoApi.revokeValid(jyzId);
    	if(result != null && result.getResultCode() == 0){
    		systemLogManageService.dataLog("jyzId", SystemActionLogType.REVOKEAPPROVE, "经营者", jyzId.toString());
    	}
    	return result;
    }

    @RequestMapping(value ="/serviceapi/pre/idcinfo/validate", method = {  RequestMethod.POST })
    @ResponseBody
    public AjaxValidationResult validate(IDCInformationDTO idcInformation){
        return preIdcInfoApi.validate(idcInformation);
    }

    @RequestMapping(value ="/serviceapi/pre/idcinfo/preValidate", method = {  RequestMethod.POST })
    @ResponseBody
    @RequiresPermission(value = "ROLE_IDC_PREVALID")
    @HystrixCommand(defaultFallback="handleHystrixResultDto")
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.APPROVE)
    public ResultDto preValidate(Integer jyzId, HttpServletRequest request){
    	ResultDto result = preIdcInfoApi.preValidate(jyzId);
        if(result != null && result.getResultCode() == 0){
    		systemLogManageService.dataLog("jyzId", SystemActionLogType.APPROVE, "经营者", jyzId.toString());
    	}
        return result;
    }

    @RequestMapping(value ="/serviceapi/pre/idcinfo/preValidateCascade", method = {  RequestMethod.POST })
    @ResponseBody
    @RequiresPermission(value = "ROLE_IDC_CASCADEVALID")
    @HystrixCommand(defaultFallback="handleHystrixResultDto")
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.CASCADEAPPROVE)
    public ResultDto preValidateCascade(Integer jyzId, HttpServletRequest request){
    	ResultDto result = preIdcInfoApi.preValidateCascade(jyzId);
        if(result != null && result.getResultCode() == 0){
    		systemLogManageService.dataLog("jyzId", SystemActionLogType.CASCADEAPPROVE, "经营者", jyzId.toString());
    	}
        return result;
    }

    @RequestMapping(value ="/serviceapi/pre/idcinfo/idcValidateMsg", method = {  RequestMethod.POST })
    @ResponseBody
    public List<ApproveResultDto> getChkResult(String jyzId){
        List<ApproveResultDto> result = new ArrayList<>();
        String resultId = (String) baseRedisService.getHash(RedisKeyConstant.DATA_APPROVE_CACHE,"1_"+jyzId);
        if(resultId==null){
            return null;
        }else {
            result = preIdcInfoApi.idcValidateMsg(resultId);
        }
        return preIdcInfoApi.idcValidateMsg(resultId);
    }


    @RequestMapping("/idc/exportExcel")
    @RequiresPermission(value = "ROLE_IDC_EXPORT")
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.EXPORT)
    public void exportExcel(IDCInformationDTO domain, HttpServletRequest request, HttpServletResponse response) {
        try{
            HSSFWorkbook wb=exportListBook();
            /*SimpleDateFormat sf=new SimpleDateFormat("yyyyMMddHHmmss");
            String fileName=sf.format(new Date());*/
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-disposition", "attachment;filename="+getFileNameDisplay("经营者信息",request) +".xls");
            OutputStream ouputStream = response.getOutputStream();
            wb.write(ouputStream);
            ouputStream.flush();
            ouputStream.close();

        }catch (Exception e) {
            log.error("idc exportExcel error：" + e.getMessage());
        }
    }

    private String getFileNameDisplay(String fileName, HttpServletRequest request) throws Exception {
        if ("FF".equals(getBrowser(request))) { // 针对火狐浏览器处理方式不一样了
            return new String(fileName.getBytes("UTF-8"),  "iso-8859-1");
        }
        return toUtf8String(fileName); // 解决汉字乱码
    }

    private static String getBrowser(HttpServletRequest request) {
        String UserAgent = request.getHeader("USER-AGENT").toLowerCase();
        if (UserAgent != null) {
            if (UserAgent.indexOf("msie") >= 0)
                return "IE";
            if (UserAgent.indexOf("firefox") >= 0)
                return "FF";
            if (UserAgent.indexOf("safari") >= 0)
                return "SF";
        }
        return null;
    }

    public static String toUtf8String(String s){
        StringBuffer sb = new StringBuffer();
        for (int i=0;i<s.length();i++){
            char c = s.charAt(i);
            if (c >= 0 && c <= 255){
                sb.append(c);
            }else{
                byte[] b;
                try {
                    b = Character.toString(c).getBytes("utf-8");
                }catch (Exception ex) {
                    b = new byte[0];
                }
                for (int j = 0; j < b.length; j++) {
                    int k = b[j];
                    if (k < 0) k += 2<<(8-1);
                    sb.append("%" + Integer.toHexString(k).toUpperCase());
                }
            }
        }
        return sb.toString();
    }

    public HSSFWorkbook exportListBook()throws Exception{
        PageResult<IdcInformation> re=preIdcInfoApi.listIdcInfo();
        List<IdcInformation> list=re.getRows();
        return buildWorkBook(list);
    }

    public HSSFWorkbook buildWorkBook(List<IdcInformation> list){
        String []excelHeader={"*许可证号\n","*经营者名称\n","*企业法人\n","*通信地址邮编\n",
                "*经营者通信地址\n","*网络信息安全\n责任人姓名\"\n",
                "\"*网络信息安全\n责任人证件类型\"\n","\"*网络信息安全\n责任人证件号码\"\n","\"*网络信息安全\n责任人固定电话\"\n",
        "\"*网络信息安全\n责任人移动电话\"\n","\"*网络信息安全\n责任人Email\"\n","*应急联系人姓名\n","*应急联系人证件类型\n",
        "*应急联系人证件号码\n","*应急联系人固定电话\n","*应急联系人移动电话\n","*应急联系人Email\n",};//19个字段
        int[] excelHeaderWidth = { 100, 120, 100, 100, 100,100, 100, 100,100,100, 100, 100,100,100, 100, 100,100};
        HSSFWorkbook wb=new HSSFWorkbook();
        HSSFSheet sheet=wb.createSheet("经营者信息");
        HSSFRow row = sheet.createRow((int) 0);
//	     HSSFCellStyle style = wb.createCellStyle();

        for (int i = 0; i < excelHeader.length; i++) {
            HSSFCell cell = row.createCell(i);
            cell.setCellValue(excelHeader[i]);
            //cell.setCellStyle(buildStyle(wb,"columnTitle",""));
            sheet.autoSizeColumn(i);
        }
        for (int i = 0; i < excelHeaderWidth.length; i++) {
            sheet.setColumnWidth(i, 52 * excelHeaderWidth[i]);
        }
        for (int i = 0; i < list.size(); i++) {
            row = sheet.createRow(i + 1);
            row.createCell(0).setCellValue(list.get(i).getIdcId());
            row.createCell(1).setCellValue(list.get(i).getIdcName());
            row.createCell(2).setCellValue(list.get(i).getCorporater());
            row.createCell(3).setCellValue(list.get(i).getIdcZipCode());
            row.createCell(4).setCellValue(list.get(i).getIdcAddress());
            row.createCell(5).setCellValue(list.get(i).getOfficerName());
            row.createCell(6).setCellValue(getIdTypeName(list.get(i).getOfficerIdType()));//证件类型
            row.createCell(7).setCellValue(list.get(i).getOfficerId());
            row.createCell(8).setCellValue(list.get(i).getOfficerTelephone());
            row.createCell(9).setCellValue(list.get(i).getOfficerMobile());
            row.createCell(10).setCellValue(list.get(i).getOfficerEmail());
            row.createCell(11).setCellValue(list.get(i).getEcName());
            row.createCell(12).setCellValue(getIdTypeName(list.get(i).getEcIdType()));//证件类型
            row.createCell(13).setCellValue(list.get(i).getEcId());
            row.createCell(14).setCellValue(list.get(i).getEcTelephone());
            row.createCell(15).setCellValue(list.get(i).getEcMobile());
            row.createCell(16).setCellValue(list.get(i).getEcEmail());
        }
        return wb;
    }

    public String getIdTypeName(Integer id){
        if(id==2){
            return "2-身份证";
        }else if(id==7){
            return "7-护照";
        }else if(id==8){
            return "8-军官证";
        }else if(id==9){
            return "9-台胞证";
        }else{
            return "";
        }
    }
}
