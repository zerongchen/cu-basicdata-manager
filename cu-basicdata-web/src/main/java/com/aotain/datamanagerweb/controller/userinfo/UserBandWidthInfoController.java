package com.aotain.datamanagerweb.controller.userinfo;

import com.aotain.cu.serviceapi.dto.AjaxValidationResult;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.dto.UserBandwidthInformationDTO;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.datamanagerweb.annotation.LogAction;
import com.aotain.datamanagerweb.annotation.RequiresPermission;
import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.datamanagerweb.mapper.CommonMapper;
import com.aotain.datamanagerweb.model.SelectInfoBean;
import com.aotain.datamanagerweb.service.CommonService;
import com.aotain.datamanagerweb.service.system.SystemLogManageService;
import com.aotain.datamanagerweb.service.userservice.UserBandWidthService;
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
@RequestMapping(value = "/userbandwidth")
public class UserBandWidthInfoController {
	
	private static final String MODULE_NAME = "用户带宽";

    private Logger log = LoggerFactory.getLogger(UserBandWidthInfoController.class);

    @Autowired
    private CommonService commonService;

    @Autowired
    private UserBandWidthService userBandWidthService;
    
    @Autowired
    private CommonMapper commonMapper;

    @Autowired
    private SystemLogManageService systemLogManageService;
    /**
     * 首页加载
     * @return
     */
    @RequestMapping(value = "/index",method = RequestMethod.GET)
    public String getIndex(){
        return "/userbandwidth/index";
    }

    /**
     * 首页查询
     * @param dto
     * @return
     */
    @RequiresPermission(value="ROLE_PRE_USER_HH_QUERY")
    @RequestMapping(value = "/bandwidthlist",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME)
    public PageResult<UserBandwidthInformationDTO> getHouseIndexData(UserBandwidthInformationDTO dto){
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        PageResult<UserBandwidthInformationDTO> result = new PageResult<UserBandwidthInformationDTO>();
        try{
            result = userBandWidthService.queryService(dto);
        }catch (Exception e){
            result = null;
            log.error("get bandwidth fail",e);
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
            JavaType javaType = objectMapper.getTypeFactory().constructParametricType(List.class, UserBandwidthInformationDTO.class);
            List<UserBandwidthInformationDTO> bandWidths = objectMapper.readValue(dtos, javaType);
            for(UserBandwidthInformationDTO tmp : bandWidths){
                result = userBandWidthService.validateService(tmp);
                if(!result.getErrorsArgsMap().isEmpty()){
                    return result;
                }
            }
        }catch (Exception e){
            result = null;
            log.error("validate user bandwidth fail",e);
        }
        return result;
    }

    /**
     * 新增用户带宽信息
     * @param dtos
     * @return
     */
    @RequiresPermission(value="ROLE_PRE_USER_HH_ADD")
    @RequestMapping(value = "/save",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME)
    public ResultDto save(@RequestBody String  dtos){
        ResultDto result = new ResultDto();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JavaType javaType = objectMapper.getTypeFactory().constructParametricType(List.class, UserBandwidthInformationDTO.class);
            List<UserBandwidthInformationDTO> bandWidths = objectMapper.readValue(dtos, javaType);
            List<UserBandwidthInformationDTO> list = new ArrayList<UserBandwidthInformationDTO>();
            for(UserBandwidthInformationDTO dto :bandWidths){
            	SelectInfoBean bean = new SelectInfoBean();
        		bean.setUserId(dto.getUserId());
        		bean.setHouseId(dto.getHouseId());
            	dto.setUnitName(commonMapper.getUserSelectInfo(bean).get(0).getTitle());
            	dto.setUserName(commonMapper.getHouseSelectInfo(bean).get(0).getTitle());
            	dto.setCreateUserId(SpringUtil.getSystemOperator().getUserId());
            	dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
            	dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
            	dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
            	list.add(dto);
            }
            result = userBandWidthService.insertService(list);
            if(result.getResultCode()==0){
                Set<String> keys = result.getAjaxValidationResultMap().keySet();
                for(String key: keys){
                    systemLogManageService.dataLog("hhId", SystemActionLogType.CREATE, MODULE_NAME,  result.getAjaxValidationResultMap().get(key).getPid().toString());
                }
            }
        }catch (Exception e){
            result.setResultCode(1);
            log.error("save user bandwidth fail",e);
        }
        return result;
    }

    /**
     * 更新用户带宽信息
     * @param dtos
     * @return
     */
    @RequiresPermission(value="ROLE_PRE_USER_HH_UPDATE")
    @RequestMapping(value = "/update",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME)
    public ResultDto update(@RequestBody String  dtos){
        ResultDto result = new ResultDto();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JavaType javaType = objectMapper.getTypeFactory().constructParametricType(List.class, UserBandwidthInformationDTO.class);
            List<UserBandwidthInformationDTO> bandWidths = objectMapper.readValue(dtos, javaType);
            List<UserBandwidthInformationDTO> list = new ArrayList<UserBandwidthInformationDTO>();
            for(UserBandwidthInformationDTO dto :bandWidths){
            	dto.setUpdateUserId(SpringUtil.getSystemOperator().getUserId());
            	dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
            	dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
            	dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
            	list.add(dto);
            }
            result = userBandWidthService.updateService(list);
            systemLogManageService.dataLog(list.get(0),"hhId", SystemActionLogType.UPDATE, MODULE_NAME, list.get(0).getHhId());
        }catch (Exception e){
            log.error("save user bandwidth fail");
        }
        return result;
    }


    /**
     * 删除用户带宽信息
     * @param hhIds
     * @return
     */
    @RequiresPermission(value="ROLE_PRE_USER_HH_DEL")
    @RequestMapping(value = "/delete",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME)
    public ResultDto delete(@RequestParam("hhIds[]") Long[] hhIds) {
        ResultDto result = new ResultDto();
        try {
        	List<UserBandwidthInformationDTO> list = new ArrayList<UserBandwidthInformationDTO>();
        	UserBandwidthInformationDTO dto = null;
        	for(Long id:Arrays.asList(hhIds)){
        		dto = new UserBandwidthInformationDTO();
        		dto.setHhId(id);
        		dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        		dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        		dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
            	list.add(dto);
            }
            result = userBandWidthService.deleteService(list);
            systemLogManageService.dataLog("hhId", SystemActionLogType.DELETE, MODULE_NAME, hhIds);
        } catch (Exception e) {
            log.error("save user service fail");
        }
        return result;
    }

}
