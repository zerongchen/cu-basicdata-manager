package com.aotain.datamanagerweb.controller.handlefile;

import com.aotain.cu.serviceapi.dto.HouseInformationDTO;
import com.aotain.cu.serviceapi.dto.UserInformationDTO;
import com.aotain.datamanagerweb.annotation.LogAction;
import com.aotain.datamanagerweb.annotation.RequiresPermission;
import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.datamanagerweb.service.handlefile.FileHandleService;
import com.aotain.datamanagerweb.utils.FileTools;
import com.aotain.datamanagerweb.utils.SpringUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/export")
public class ExportHandleController {
	
	private static final String IDC_MODULE_NAME = "经营者";
	private static final String HOUSE_MODULE_NAME = "机房";
	private static final String USER_MODULE_NAME = "用户";
	private static final String ISP_MODULE_NAME = "ISP用户上报过滤管理";

    private Logger logger= LoggerFactory.getLogger(ExportHandleController.class);

    @Autowired
    private FileHandleService fileHandleService;

    @LogAction(module=IDC_MODULE_NAME,type=SystemActionLogType.DOWNLOAD_TEMPLATE)
    @RequestMapping("idcTemplate")
    @ResponseBody
    public void exportTemplateIdc( HttpServletRequest request, HttpServletResponse response){
        try{
            fileHandleService.exportTemplate(request,response,"idcInfoTemplate","经营者导入模板");
        } catch (Exception e){
            logger.error("export idc template error..",e);
        }
    }
    
    @LogAction(module=IDC_MODULE_NAME,type=SystemActionLogType.DOWNLOAD_ERROR_FILE)
    @RequestMapping("idcErrorFile")
    @ResponseBody
    public void exportIdcErrorFile( HttpServletRequest request, HttpServletResponse response,String errorFileName){
        try{
            fileHandleService.exportIdcErrorFile(request,response,errorFileName);
        } catch (Exception e){
            logger.error("export idc template error..",e);
        }
    }

    @RequestMapping("userTemplate")
    @ResponseBody
    @LogAction(module=USER_MODULE_NAME,type=SystemActionLogType.DOWNLOAD_TEMPLATE)
    public void exportTemplate( HttpServletRequest request, HttpServletResponse response){
        try{
            //fileHandleService.exportTemplate(request,response,"userInformationTemplate");
            fileHandleService.exportTemplate(request,response,"userInformationTemplate","用户信息导入模板");
        } catch (Exception e){
            logger.error("export user template error..",e);
        }
    }

    @RequestMapping("houseTemplate")
    @ResponseBody
    @LogAction(module=HOUSE_MODULE_NAME,type=SystemActionLogType.DOWNLOAD_TEMPLATE)
    public void exportHouseTemplate( HttpServletRequest request, HttpServletResponse response){
        try{
            fileHandleService.exportTemplate(request,response,"houseInformationTemplate","机房信息导入模板");
        } catch (Exception e){
            logger.error("export house template error..",e);
        }
    }

    @LogAction(module=USER_MODULE_NAME,type=SystemActionLogType.DOWNLOAD_ERROR_FILE)
    @RequestMapping("userErrorFile")
    @ResponseBody
    public void exportUserErrorFile( HttpServletRequest request, HttpServletResponse response,String errorFileName){
        try{
            fileHandleService.exportUserErrorFile(request,response,errorFileName);
        } catch (Exception e){
            logger.error("export user template error..",e);
        }
    }

    @LogAction(module=HOUSE_MODULE_NAME,type=SystemActionLogType.DOWNLOAD_ERROR_FILE)
    @RequestMapping("houseErrorFile")
    @ResponseBody
    public void exportHouseErrorFile( HttpServletRequest request, HttpServletResponse response,String errorFileName){
        try{
            fileHandleService.exportHouseErrorFile(request,response,errorFileName);
        } catch (Exception e){
            logger.error("export house template error..",e);
        }
    }


    @RequiresPermission(value="ROLE_PRE_USER_EXPORT")
    @LogAction(module=USER_MODULE_NAME,type=SystemActionLogType.EXPORT)
    @RequestMapping("exportUserData")
    @ResponseBody
    public void exportUserData( HttpServletRequest request, HttpServletResponse response, UserInformationDTO dto){
        try{
            dto.setAreaCodes(StringUtils.join(SpringUtil.getSystemOperator().getAreaList(),","));
            dto.setAuthIdentities(StringUtils.join(SpringUtil.getSystemOperator().getAuthIdentityList(),","));
            dto.setAuthHouses(StringUtils.join(SpringUtil.getSystemOperator().getAuthHouseList(),","));
            fileHandleService.exportUserData(request,response,dto);
        } catch (Exception e){
            logger.error("export user template error..",e);
        }
    }

    @RequiresPermission(value="ROLE_PRE_HOUSE_EXPORT")
    @LogAction(module=HOUSE_MODULE_NAME,type=SystemActionLogType.EXPORT)
    @RequestMapping("exportHouseData")
    @ResponseBody
    public void exportHouseData( HttpServletRequest request, HttpServletResponse response, HouseInformationDTO dto){
        try{

            dto.setAreaCodes(StringUtils.join(SpringUtil.getSystemOperator().getAreaList(), ","));
            dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
            dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
            fileHandleService.exportHouseData(request,response,dto);
        } catch (Exception e){
            logger.error("export house data error..",e);
        }
    }

    @RequiresPermission(value="RPT_HOUSE_EXPORT")
    @LogAction(module=HOUSE_MODULE_NAME,type=SystemActionLogType.EXPORT)
    @RequestMapping("exportRptHouseData")
    @ResponseBody
    public void exportRptHouseData( HttpServletRequest request, HttpServletResponse response, HouseInformationDTO dto){
        try{
            dto.setAreaCodes(StringUtils.join(SpringUtil.getSystemOperator().getAreaList(), ","));
            dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
            dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
            fileHandleService.exportRptHouseData(request,response,dto);
        } catch (Exception e){
            logger.error("export house data error..",e);
        }
    }

    /**
     * 上报用户信息导出
     * @param request
     * @param response
     * @param dto
     */
    @RequestMapping("exportRptUserData")
    @ResponseBody
    public void exportRptUserData( HttpServletRequest request, HttpServletResponse response, UserInformationDTO dto){
        try{
            dto.setAreaCodes(StringUtils.join(SpringUtil.getSystemOperator().getAreaList(), ","));
            dto.setAuthIdentities(StringUtils.join(SpringUtil.getSystemOperator().getAuthIdentityList(), ","));
            fileHandleService.exportRptUserData(request,response,dto);
        } catch (Exception e){
            logger.error("export house data error..",e);
        }
    }


    /**
     * ISP模板导出
     * @param request
     * @param response
     */
    @RequestMapping("ispTemplate")
    @ResponseBody
    @LogAction(module=ISP_MODULE_NAME,type=SystemActionLogType.DOWNLOAD_TEMPLATE)
    @RequiresPermission(value = "ROLE_ISP_DOWNLOAD_TEMPLATE")
    public void exportIspTemplate( HttpServletRequest request, HttpServletResponse response){
        try{
            fileHandleService.exportTemplate(request,response,"ispTemplate","ispTemplate");
        } catch (Exception e){
            logger.error("export user template error..",e);
        }
    }

    /**
     *  ISP错误导出
     * @param request
     * @param response
     * @param errorFileName
     */
    @LogAction(module=ISP_MODULE_NAME,type=SystemActionLogType.DOWNLOAD_ERROR_FILE)
    @RequestMapping("ispErrorFile")
    @ResponseBody
    @RequiresPermission(value = "ROLE_ISP_DOWNLOAD_ERROR_FILE")
    public void exportispErrorFile( HttpServletRequest request, HttpServletResponse response,String errorFileName){
        try{
            fileHandleService.exportIspErrorFile(request,response,errorFileName);
        } catch (Exception e){
            logger.error("export user template error..",e);
        }
    }
}
