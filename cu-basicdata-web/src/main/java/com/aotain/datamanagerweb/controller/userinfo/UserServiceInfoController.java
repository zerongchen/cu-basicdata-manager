package com.aotain.datamanagerweb.controller.userinfo;

import com.aotain.cu.serviceapi.dto.AjaxValidationResult;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.dto.UserServiceInformationDTO;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.cu.serviceapi.model.ServiceDomainInformation;
import com.aotain.datamanagerweb.annotation.LogAction;
import com.aotain.datamanagerweb.annotation.RequiresPermission;
import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.datamanagerweb.service.CommonService;
import com.aotain.datamanagerweb.service.system.SystemLogManageService;
import com.aotain.datamanagerweb.service.userservice.UserServiceService;
import com.aotain.datamanagerweb.utils.SpringUtil;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * @ClassName UserInformationController
 * @Author tanzj
 * @Date 2018/8/06
 **/
@Component
@Controller
@RequestMapping(value = "/userservice")
public class UserServiceInfoController {
	
	private static final String MODULE_NAME = "用户服务";

    private Logger log = LoggerFactory.getLogger(UserServiceInfoController.class);

    @Autowired
    private UserServiceService userService;

    @Autowired
    private CommonService commonService;

    @Autowired
    private SystemLogManageService systemLogManageService;
    /**
     * 首页加载
     * @return
     */
    @RequestMapping(value = "/index",method = RequestMethod.GET)
    public String getIndex(){
        return "/userservice/index";
    }

    /**
     * 首页查询
     * @param dto
     * @return
     */
    @RequiresPermission(value="ROLE_PRE_USER_SERVICE_QUERY")
    @RequestMapping(value = "/servicelist",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.READ)
    public PageResult<UserServiceInformationDTO> getHouseIndexData(UserServiceInformationDTO dto){
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        PageResult<UserServiceInformationDTO> result = new PageResult<UserServiceInformationDTO>();
        try{
            result = userService.queryService(dto);
        }catch (Exception e){
            result = null;
            log.error("get service fail",e);
        }
        return result;
    }

    /**
     * 校验用户服务信息
     * @param dto
     * @return
     */
    @RequestMapping(value = "/validate",method = RequestMethod.POST)
    @ResponseBody
    public AjaxValidationResult validateData(@RequestBody UserServiceInformationDTO dto){
        AjaxValidationResult result = new AjaxValidationResult();
        try {
            result = userService.validateService(dto);
        }catch (Exception e){
            result = null;
            log.error("validate user service fail",e);
        }
        return result;
    }

    /**
     * 保存用户服务信息
     * @param
     * @return
     */
    @RequiresPermission(value="ROLE_PRE_USER_SERVICE_ADD")
    @RequestMapping(value = "/save",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.CREATE)
    public ResultDto save(@RequestBody String  dtos){
        ResultDto result = new ResultDto();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JavaType javaType = objectMapper.getTypeFactory().constructParametricType(List.class, UserServiceInformationDTO.class);
            List<UserServiceInformationDTO> bo = objectMapper.readValue(dtos, javaType);
            List<UserServiceInformationDTO> list = new ArrayList<UserServiceInformationDTO>();
            for(UserServiceInformationDTO dto :bo){
                dto.setCreateUserId(SpringUtil.getSystemOperator().getUserId());
                dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
                dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
                dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
                list.add(dto);
            }
            result = userService.insertService(list);
            if(result.getResultCode()==0){
                Set<String> keys = result.getAjaxValidationResultMap().keySet();
                for(String key: keys){
                    systemLogManageService.dataLog("serviceId", SystemActionLogType.CREATE, MODULE_NAME,  result.getAjaxValidationResultMap().get(key).getPid().toString());
                }
            }
        }catch (Exception e){
            result.setResultCode(1);
            log.error("save user service fail",e);
        }
        return result;
    }

    /**
     * 更新用户服务信息
     * @param
     * @return
     */
    @RequiresPermission(value="ROLE_PRE_USER_SERVICE_UPDATE")
    @RequestMapping(value = "/update",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.UPDATE)
    public ResultDto update(@RequestBody String  dtos){
        ResultDto result = new ResultDto();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JavaType javaType = objectMapper.getTypeFactory().constructParametricType(List.class, UserServiceInformationDTO.class);
            List<UserServiceInformationDTO> bo = objectMapper.readValue(dtos, javaType);
            List<UserServiceInformationDTO> list = new ArrayList<UserServiceInformationDTO>();
            for(UserServiceInformationDTO dto :bo){
                dto.setCreateUserId(SpringUtil.getSystemOperator().getUserId());
                dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
                dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
                dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
                list.add(dto);
            }
            result = userService.updateService(list);
            systemLogManageService.dataLog("serviceId", SystemActionLogType.UPDATE, MODULE_NAME, list.get(0).getServiceId().toString());
        }catch (Exception e){
            log.error("save user service fail",e);
        }
        return result;
    }

    /**
     * 删除用户服务信息
     * @param ids
     * @return
     */
    @RequiresPermission(value="ROLE_PRE_USER_SERVICE_DEL")
    @RequestMapping(value = "/delete",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.DELETE)
    public ResultDto delete(@RequestParam("ids[]") Long[] ids){
        ResultDto result = new ResultDto();
        try {
            List<UserServiceInformationDTO> list=new ArrayList<UserServiceInformationDTO>();
            for (Long id:ids){
                UserServiceInformationDTO bo=new UserServiceInformationDTO();
                bo.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
                bo.setUpdateUserId(SpringUtil.getSystemOperator().getUserId());
                bo.setServiceId(id);
                list.add(bo);
            }
            result = userService.deleteService(list);
            systemLogManageService.dataLog("serviceId", SystemActionLogType.DELETE, MODULE_NAME, ids);
        }catch (Exception e){
            log.error("save user service fail",e);
        }
        return result;
    }

}
