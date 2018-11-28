package com.aotain.datamanagerweb.controller.userinfo;

import com.aotain.cu.serviceapi.dto.AjaxValidationResult;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.dto.UserVirtualInformationDTO;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.cu.serviceapi.model.UserVirtualInformation;
import com.aotain.datamanagerweb.annotation.LogAction;
import com.aotain.datamanagerweb.annotation.RequiresPermission;
import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.datamanagerweb.service.system.SystemLogManageService;
import com.aotain.datamanagerweb.service.userservice.UserVirtualService;
import com.aotain.datamanagerweb.utils.SpringUtil;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.thoughtworks.xstream.io.naming.NameCoderWrapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.*;

/**
 * Demo class
 *
 * @author bang
 * @date 2018/08/10
 */
@RestController
@RequestMapping(value = "/uservirtual")
public class UserVirtualController {
	
	private static final String MODULE_NAME = "用户虚拟机";

    private static final Logger logger = LoggerFactory.getLogger(UserVirtualController.class);

    @Autowired
    private UserVirtualService userVirtualService;

    @Autowired
    private SystemLogManageService systemLogManageService;
    /**
     * 首页加载
     * @return
     */
    @RequestMapping(value = "/index",method = RequestMethod.GET)
    public ModelAndView getIndex(){
        ModelAndView mv = new ModelAndView();
        mv.setViewName("/uservirtual/index");
        return mv;
    }

    /**
     * 首页查询
     * @param dto
     * @return
     */
    @RequiresPermission(value="ROLE_PRE_USER_VIRTUAL_QUERY")
    @RequestMapping(value = "/listData",method = RequestMethod.POST)
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.READ)
    public PageResult<UserVirtualInformationDTO> getHouseIndexData(UserVirtualInformationDTO dto){
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        PageResult<UserVirtualInformationDTO> result = new PageResult<UserVirtualInformationDTO>();
        try{
            result = userVirtualService.listData(dto);
        }catch (Exception e){
            result = null;
            logger.error("get service fail",e);
        }
        return result;
    }


    /**
     * 删除用户虚拟机信息
     * @param ids
     * @return
     */
    @RequiresPermission(value="ROLE_PRE_USER_VIRTUAL_DEL")
    @RequestMapping(value = "/batchDelete",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.DELETE)
    public ResultDto delete(@RequestParam("ids[]") Long[] ids){
        ResultDto result = new ResultDto();
        try {
        	UserVirtualInformation dto = null;
        	List<UserVirtualInformation> list = new ArrayList<>();
        	for(Long id:Arrays.asList(ids)){
        		dto = new UserVirtualInformationDTO();
        		dto.setVirtualId(id);
        		dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
            	dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
            	dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
            	list.add(dto);
        	}
            result = userVirtualService.deleteVirtuals(list);
            systemLogManageService.dataLog("virtualId", SystemActionLogType.DELETE, MODULE_NAME, ids);
        }catch (Exception e){
            logger.error("save user virtual fail",e);
        }
        return result;
    }

    /**
     * 校验用户带宽信息
     * @param dtos
     * @return
     */
    @RequestMapping(value = "/validate",method = RequestMethod.POST)
    @ResponseBody
    public AjaxValidationResult validateData(@RequestBody String  dtos){
        AjaxValidationResult result = new AjaxValidationResult();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JavaType javaType = objectMapper.getTypeFactory().constructParametricType(List.class, UserVirtualInformationDTO.class);
            List<UserVirtualInformationDTO> bandWidths = objectMapper.readValue(dtos, javaType);
            for(UserVirtualInformationDTO tmp : bandWidths){
                result = userVirtualService.validateService(tmp);
                if(!result.getErrorsArgsMap().isEmpty()){
                    return result;
                }
            }
        }catch (Exception e){
            result = null;
            logger.error("validate user bandwidth fail",e);
        }
        return result;
    }


    /**
     * 保存虚拟主机信息
     * @param dtos
     * @return
     */
    @RequiresPermission(value="ROLE_PRE_USER_VIRTUAL_ADD")
    @RequestMapping(value = "/save",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.CREATE)
    public ResultDto save(@RequestBody String  dtos){
        ResultDto result = new ResultDto();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JavaType javaType = objectMapper.getTypeFactory().constructParametricType(List.class, UserVirtualInformation.class);
            List<UserVirtualInformation> bandWidths = objectMapper.readValue(dtos, javaType);
            List<UserVirtualInformation> list = new ArrayList();
            for(UserVirtualInformation dto:bandWidths){
            	dto.setCreateUserId(SpringUtil.getSystemOperator().getUserId());
            	dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
            	dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
            	dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
            	list.add(dto);
            }
            result = userVirtualService.insertVirtual(list);
            if(result.getResultCode()==0){
                Set<String> keys = result.getAjaxValidationResultMap().keySet();
                for(String key: keys){
                    systemLogManageService.dataLog("virtualId", SystemActionLogType.CREATE, MODULE_NAME,  result.getAjaxValidationResultMap().get(key).getPid().toString());
                }
            }
        }catch (Exception e){
            result.setResultCode(1);
            logger.error("save user bandwidth fail",e);
        }
        return result;
    }

    /**
     * 更新虚拟主机信息
     * @param dtos
     * @return
     */
    @RequiresPermission(value="ROLE_PRE_USER_VIRTUAL_UPDATE")
    @RequestMapping(value = "/update",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.UPDATE)
    public ResultDto update(@RequestBody String  dtos){
        ResultDto result = new ResultDto();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JavaType javaType = objectMapper.getTypeFactory().constructParametricType(List.class, UserVirtualInformation.class);
            List<UserVirtualInformation> bandWidths = objectMapper.readValue(dtos, javaType);
            List<UserVirtualInformation> list = new ArrayList();
            UserVirtualInformation dto = bandWidths.get(0);
            dto.setUpdateUserId(SpringUtil.getSystemOperator().getUserId());
            dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
            dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
            dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
            list.add(dto);
            result = userVirtualService.updateVirtual(list);
            systemLogManageService.dataLog("virtualId", SystemActionLogType.UPDATE, MODULE_NAME, dto.getVirtualId().toString());
        }catch (Exception e){
            logger.error("save user bandwidth fail");
        }
        return result;
    }
}
