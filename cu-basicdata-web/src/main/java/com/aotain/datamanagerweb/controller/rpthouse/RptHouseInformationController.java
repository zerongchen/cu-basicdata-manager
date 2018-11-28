package com.aotain.datamanagerweb.controller.rpthouse;

import com.alibaba.fastjson.JSON;
import com.aotain.cu.serviceapi.dto.HouseFrameInformationDTO;
import com.aotain.cu.serviceapi.dto.HouseGatewayInformationDTO;
import com.aotain.cu.serviceapi.dto.HouseIPSegmentInforDTO;
import com.aotain.cu.serviceapi.dto.HouseInformationDTO;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.datamanagerweb.annotation.LogAction;
import com.aotain.datamanagerweb.annotation.RequiresPermission;
import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.datamanagerweb.service.rpthouse.RptHouseServiceApi;
import com.aotain.datamanagerweb.utils.DateUtils;
import com.aotain.datamanagerweb.utils.SpringUtil;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * 机房上报信息查询
 * @ClassName RptHouseInformationController
 * @Author tanzj
 * @Date 2018/8/10
 **/
@Component
@Controller
@RequestMapping(value = "/rpt")
public class RptHouseInformationController {
	
	private static final String HOUSE_MAIN_MODULE_NAME = "上报机房主体";
	private static final String HOUSE_FRAMEMODULE_NAME = "上报机房机架";
	private static final String HOUSE_LINK_MODULE_NAME = "上报机房链路";
	private static final String HOUSE_IPSEG_MODULE_NAME = "上报机房IP地址段";

    private Logger log = LoggerFactory.getLogger(RptHouseInformationController.class);

    @Autowired
    private RptHouseServiceApi rptHouseServiceApi;


    /**
     * 上报ip信息页面
     * @return
     */
    @RequestMapping(value = "/houseip/index",method = RequestMethod.GET)
    public String getHouseIpIndex(){
        return "/rpthouse/houseip_index";
    }

    /**
     * 上报机架信息页面
     * @return
     */
    @RequestMapping(value = "/houseframe/index",method = RequestMethod.GET)
    public String getHouseFrameIndex(){
        return "/rpthouse/houseframe_index";
    }

    /**
     * 上报链路信息页面
     * @return
     */
    @RequestMapping(value = "/houselink/index",method = RequestMethod.GET)
    public String getHouseLinkIndex(){
        return "/rpthouse/houselink_index";
    }

    /**
     * 上报ip查询
     * @param dto
     * @return
     */
    @LogAction(module=HOUSE_IPSEG_MODULE_NAME,type=SystemActionLogType.READ)
    @RequestMapping(value ="/houseip/list", method = {  RequestMethod.POST })
    @ResponseBody
    @RequiresPermission(value = "RPT_HOUSE_IP_QUERY")
    public PageResult<HouseIPSegmentInforDTO> queryHouseIp(HouseIPSegmentInforDTO dto) {
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        return rptHouseServiceApi.preIpQuery(dto);
    }

    /**
     * 上报机架信息查询
     * @param dto
     * @return
     */
    @RequestMapping(value ="/houseframe/list", method = {  RequestMethod.POST })
    @ResponseBody
    @RequiresPermission(value = "RPT_HOUSE_FRAME_QUERY")
    @LogAction(module=HOUSE_FRAMEMODULE_NAME,type=SystemActionLogType.READ)
    public PageResult<HouseFrameInformationDTO> queryHouseFrame(HouseFrameInformationDTO dto) {
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        return rptHouseServiceApi.preFramQuery(dto);
    }

    /**
     * 上报链路查询
     * @param dto
     * @return
     */
    @RequestMapping(value ="/houselink/list", method = {  RequestMethod.POST })
    @ResponseBody
    @RequiresPermission(value = "RPT_HOUSE_LINK_QUERY")
    @LogAction(module=HOUSE_LINK_MODULE_NAME,type=SystemActionLogType.READ)
    public PageResult<HouseGatewayInformationDTO> queryHouseLink(HouseGatewayInformationDTO dto) {
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        return rptHouseServiceApi.preLinkQuery(dto);
    }





    @RequestMapping(value = "/house/index",method = RequestMethod.GET)
    public String getHouseIndex(){
        return "/rpthouse/house_index";
    }

    @RequestMapping(value ="/house/query", method = {  RequestMethod.POST })
    @ResponseBody
    @RequiresPermission(value = "RPT_HOUSE_QUERY")
    @LogAction(module=HOUSE_MAIN_MODULE_NAME,type=SystemActionLogType.READ)
    public PageResult<HouseInformationDTO> listHouseInfo(HouseInformationDTO dto) {
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        return rptHouseServiceApi.listHouseInfo(dto);
    }

    @RequestMapping(value ="/house/detail", method = {  RequestMethod.POST })
    @ResponseBody
    @RequiresPermission(value = "RPT_HOUSE_DETAIL")
    @LogAction(module=HOUSE_MAIN_MODULE_NAME,type=SystemActionLogType.DETAIINFO)
    public HouseInformationDTO getDetail(String houseId) {
        return rptHouseServiceApi.getDetail(houseId);
    }

    @RequestMapping("/house/exportExcel")
    @RequiresPermission(value = "RPT_HOUSE_EXPORT")
    @LogAction(module=HOUSE_MAIN_MODULE_NAME,type=SystemActionLogType.EXPORT)
    public void exportExcel(HouseInformationDTO domain, HttpServletRequest request, HttpServletResponse response) {
        try{
            String queryParam=request.getParameter("queryParam");
            HouseInformationDTO dto=JSON.parseObject(queryParam,HouseInformationDTO.class);
            HSSFWorkbook wb=exportListBook(dto);
            SimpleDateFormat sf=new SimpleDateFormat("yyyyMMddHHmmss");
            String fileName=sf.format(new Date());
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-disposition", "attachment;filename="+fileName+".xls");
            OutputStream ouputStream = response.getOutputStream();
            wb.write(ouputStream);
            ouputStream.flush();
            ouputStream.close();

        }catch (Exception e) {
            log.error("house exportExcel error：" + e.getMessage());
        }
    }


    public HSSFWorkbook exportListBook(HouseInformationDTO domain)throws Exception{
        domain.setIsPaging(0);
        PageResult<HouseInformationDTO> re=rptHouseServiceApi.listHouseInfo(domain);
        List<HouseInformationDTO> list=re.getRows();
        return buildWorkBook(list);
    }

    public HSSFWorkbook buildWorkBook(List<HouseInformationDTO> list){
        String []excelHeader={"机房ID","机房编号","机房名称","专线标识","机房性质","机房所在地","机房负责人","更新时间"};//8个字段
        int[] excelHeaderWidth = { 100, 120, 200, 200, 100, 100,100,100};
        HSSFWorkbook wb=new HSSFWorkbook();
        HSSFSheet sheet=wb.createSheet("机房");
        HSSFRow row = sheet.createRow((int) 0);
//	     HSSFCellStyle style = wb.createCellStyle();

        for (int i = 0; i < excelHeader.length; i++) {
            HSSFCell cell = row.createCell(i);
            cell.setCellValue(excelHeader[i]);
            //cell.setCellStyle(buildStyle(wb,"columnTitle",""));
            sheet.autoSizeColumn(i);
        }
        for (int i = 0; i < excelHeaderWidth.length; i++) {
            sheet.setColumnWidth(i, 32 * excelHeaderWidth[i]);
        }
        for (int i = 0; i < list.size(); i++) {
            row = sheet.createRow(i + 1);
            row.createCell(0).setCellValue(list.get(i).getHouseId());
            row.createCell(1).setCellValue(list.get(i).getHouseIdStr());
            row.createCell(2).setCellValue(list.get(i).getHouseName());
            row.createCell(3).setCellValue(list.get(i).getIdentity());
            row.createCell(4).setCellValue(getHouseTypeName(list.get(i).getHouseType()));
            row.createCell(5).setCellValue(list.get(i).getHouseAddress());
            row.createCell(6).setCellValue(list.get(i).getHouseOfficerName());
            row.createCell(7).setCellValue(DateUtils.formatDateWT(list.get(i).getCreateTime()));
        }

        return wb;
    }

    public String getHouseTypeName(Integer id){
        if(id==1){
            return "1-租用";
        }else if(id==2){
            return "2-自建";
        }else if(id==999){
            return "999-其他";
        }else{
            return "";
        }
    }

}
