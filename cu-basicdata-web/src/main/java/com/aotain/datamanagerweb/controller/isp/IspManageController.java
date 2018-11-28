package com.aotain.datamanagerweb.controller.isp;

import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.IspModel;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.datamanagerweb.annotation.LogAction;
import com.aotain.datamanagerweb.annotation.RequiresPermission;
import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.datamanagerweb.controller.CommonHandlerController;
import com.aotain.datamanagerweb.dto.dic.AreaModel;
import com.aotain.datamanagerweb.service.isp.IspService;
import com.aotain.datamanagerweb.utils.SpringUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 *@author chenzr
 */
@Component
@Controller
@RequestMapping(value = "/isp")
public class IspManageController extends CommonHandlerController {

	private Logger log = LoggerFactory.getLogger(IspManageController.class);
	private final static String MODULE_NAME = "ISP用户上报过滤管理";

	@Autowired
	private IspService ispService;
	
	@RequestMapping(value = "/index", method = RequestMethod.GET)
	@RequiresPermission(value = MODULE_NAME)
	public String getIndex(HttpServletRequest request, AreaModel areaModel) {
		return "/rptisp/index";
	}

	@RequestMapping(value = "/query", method = RequestMethod.POST)
	@ResponseBody
	@RequiresPermission(value = "ROLE_ISP_QUERY")
	@LogAction(module=MODULE_NAME,type= SystemActionLogType.READ)
	public PageResult<IspModel> query( IspModel dto, HttpServletRequest request) {
		try {
			return ispService.query(dto);
		}catch (Exception e){
			log.error("query isp data error",e);
			return new PageResult<>();
		}
	}

	@RequestMapping(value = "/updateActive", method = { RequestMethod.POST })
	@ResponseBody
	@RequiresPermission(value = "ROLE_ISP_ACTIVE")
	@LogAction(module=MODULE_NAME,type= SystemActionLogType.UPDATE)
	public ResultDto updateActive(HttpServletRequest request,@RequestBody List<Long> ids) {
		try {
			return ispService.banthActive(ids);
		}catch (Exception e){
			return getErrorResult("过滤单位上报失败！");
		}
	}


	@RequestMapping(value = "/updateInActive", method = { RequestMethod.POST })
	@ResponseBody
	@RequiresPermission(value = "ROLE_ISP_INACTIVE")
	@LogAction(module=MODULE_NAME,type= SystemActionLogType.UPDATE)
	public ResultDto updateInActive(HttpServletRequest request,@RequestBody List<Long> ids) {
		try {
			return ispService.banthInActive(ids);
		}catch (Exception e){
			return getErrorResult("取消单位上报失败！");
		}
	}

	@RequestMapping(value = "/bantchDelete", method = { RequestMethod.POST })
	@ResponseBody
	@RequiresPermission(value = "ROLE_ISP_DELETE")
	@LogAction(module=MODULE_NAME,type= SystemActionLogType.DELETE)
	public ResultDto updateDelete(HttpServletRequest request,@RequestBody List<Long> ids) {
		try {
			return ispService.banthdelete(ids);
		}catch (Exception e){
			return getErrorResult("删除失败");
		}
	}

	@RequestMapping(value = "/import", method = { RequestMethod.POST },produces = {"application/json;charset=UTF-8"} )
	@ResponseBody
	@RequiresPermission(value = "ROLE_ISP_IMPORT")
	@LogAction(module=MODULE_NAME,type= SystemActionLogType.IMPORT)
	public ResultDto importIsp(HttpServletRequest request) {
		try {

			return ispService.banthImport(request);
		}catch (Exception e){
			return getErrorResult("导入失败");
		}
	}

}
