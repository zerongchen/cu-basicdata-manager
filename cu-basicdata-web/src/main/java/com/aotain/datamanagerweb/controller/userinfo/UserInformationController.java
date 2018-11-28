package com.aotain.datamanagerweb.controller.userinfo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import com.aotain.common.config.redis.BaseRedisService;
import com.aotain.cu.serviceapi.dto.*;
import com.aotain.datamanagerweb.utils.constant.RedisKeyConstant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.cu.serviceapi.model.UserInformation;
import com.aotain.datamanagerweb.annotation.LogAction;
import com.aotain.datamanagerweb.annotation.RequiresPermission;
import com.aotain.datamanagerweb.controller.CommonHandlerController;
import com.aotain.datamanagerweb.service.system.SystemLogManageService;
import com.aotain.datamanagerweb.service.userservice.UserBandWidthService;
import com.aotain.datamanagerweb.service.userservice.UserServiceService;
import com.aotain.datamanagerweb.service.userservice.UserVirtualService;
import com.aotain.datamanagerweb.serviceapi.PreUserRackApi;
import com.aotain.datamanagerweb.utils.SpringUtil;
import com.aotain.datamanagerweb.utils.constant.HouseConstant;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;

/**
 * @ClassName UserInformationController
 * @Author chenzr
 * @Date 2018/8/03
 **/
@Component
@Controller
@RequestMapping(value = "/user")
public class UserInformationController extends CommonHandlerController {
	
	private static final String MODULE_NAME = "用户主体";

    private Logger logger = LoggerFactory.getLogger(UserInformationController.class);

    @Autowired
    private PreUserRackApi preUserRackApi;

    @Autowired
    private UserServiceService userService;

    @Autowired
    private UserVirtualService userVirtualService;

    @Autowired
    private UserBandWidthService userBandWidthService;

    @Autowired
    private SystemLogManageService systemLogManageService;

    @Autowired
    private BaseRedisService baseRedisService;

    @RequestMapping(value = "index",method = RequestMethod.GET)
    public ModelAndView getIndex(){
        ModelAndView model= new ModelAndView();
        List<String> list = SpringUtil.getSystemOperator().getAuthIdentityList();
        if (list!=null && !list.isEmpty()) {
            for (String s : list) {
                model.addObject("identifyId"+s,s);
            }
        }
        model.setViewName("/userinfo/user_index");
        return model;
    }

    @RequiresPermission(value="ROLE_PRE_USER_QUERY")
    @RequestMapping(value = "/userList",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.READ)
    public PageResult<UserInformationDTO> getUserInfoList(UserInformationDTO dto){
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        PageResult<UserInformationDTO> result = new PageResult<UserInformationDTO>();
        try{
            result = preUserRackApi.listUserInfo(dto);
        }catch (Exception e){
            logger.error("get UserInfoList error",e);
            return null;
        }
        return result;
    }
    
    @RequestMapping(value = "validate",method = RequestMethod.POST)
    @ResponseBody
    public AjaxValidationResult validate(@RequestBody UserInformationDTO dto){
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        dto.setOperateType(HouseConstant.OperationTypeEnum.ADD.getValue());
        AjaxValidationResult resultDto = preUserRackApi.validate(dto);
        return resultDto;
    }
    @RequestMapping(value = "bandwidth/validate",method = RequestMethod.POST)
    @ResponseBody
    public List<AjaxValidationResult> bandwidthValidate(@RequestBody List<UserBandwidthInformationDTO> dtos){
        try {
            List<AjaxValidationResult> list = new ArrayList<>();
            AjaxValidationResult ajaxValidationResult;
            for (UserBandwidthInformationDTO dto:dtos){
                dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
                dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
                dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
                ajaxValidationResult = preUserRackApi.bandwidthValidate(dto);
                list.add(ajaxValidationResult);
            }
            return list;
        }catch (Exception e){
            logger.error("call bandwidth validate error ",e);
            return null;
        }
    }

    @RequestMapping(value = "virtual/validate",method = RequestMethod.POST)
    @ResponseBody
    public AjaxValidationResult virtualValidate(@RequestBody UserVirtualInformationDTO dto){
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        AjaxValidationResult resultDto = preUserRackApi.virtualValidate(dto);
        return resultDto;
    }

    @RequestMapping(value = "service/validate",method = RequestMethod.POST)
    @ResponseBody
    public AjaxValidationResult serviceValidate(@RequestBody UserServiceInformationDTO dto){
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        dto.setOperateType(HouseConstant.OperationTypeEnum.ADD.getValue());
        AjaxValidationResult resultDto = preUserRackApi.serviceValidate(dto);
        return resultDto;
    }

    @RequiresPermission(value="ROLE_PRE_USER_ADD")
    @RequestMapping(value = "insert",method = RequestMethod.POST)
    @HystrixCommand(defaultFallback="handleHystrixResultDto")
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.CREATE)
    public ResultDto insert(@RequestBody UserInformationDTO dto){
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        List<ResultDto> dtos = preUserRackApi.insert(Arrays.asList(dto));
        ResultDto result = new ResultDto();
        if(dtos.get(0).getResultCode()==0){//新增成功则直接预审用户
        	result = preUserRackApi.approve(dtos.get(0).getPid().toString());
        }else{
        	result =  dtos.get(0);
        }
        if(dtos.get(0).getResultCode()==0){
            dto.setUserId(Long.valueOf(dtos.get(0).getPid()));
            systemLogManageService.dataLog(dto, "userId", SystemActionLogType.CREATE, MODULE_NAME, dto.getUserId());
        }
        return result;
    }

    @RequiresPermission(value="ROLE_PRE_USER_UPDATE")
    @RequestMapping(value = "update",method = RequestMethod.POST)
    @HystrixCommand(defaultFallback="handleHystrixResultDto")
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.UPDATE)
    public ResultDto update(@RequestBody UserInformationDTO dto){
        //虚拟iD
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        List<ResultDto> dtos = preUserRackApi.update(Arrays.asList(dto));
        ResultDto result = new ResultDto();
        if(dtos.get(0).getResultCode()==0){//新增成功则直接预审用户
        	result = preUserRackApi.approve(dto.getUserId().toString());
        }else{
        	result =  dtos.get(0);
        }
        systemLogManageService.dataLog(dto, "userId", SystemActionLogType.UPDATE, MODULE_NAME, dto.getUserId());
        return result;
    }


    @RequestMapping(value ="/userValidateMsg", method = {  RequestMethod.POST })
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.DOWNLOAD_CHECK_RESULT)
    public  List<ApproveResultDto> userValidateMsg(String userId){
        List<ApproveResultDto> result = new ArrayList<>();
        String resultId = (String) baseRedisService.getHash(RedisKeyConstant.DATA_APPROVE_CACHE,"3_"+userId);
        resultId="1";
        if(resultId==null){
            return null;
        }else {
            result = preUserRackApi.userValidateMsg(resultId);
        }
        return result;
    }

    @RequiresPermission(value="ROLE_PRE_USER_DEL")
    @RequestMapping(value ="/delete", method = {  RequestMethod.POST })
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.DELETE)
    public ResultDto delete(String ids){
        List<UserInformationDTO> list = new ArrayList<UserInformationDTO>();
        String[] arr = ids.split(",");
        UserInformationDTO bo=null;
        for (String str : arr) {
            bo=new UserInformationDTO();
            bo.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
            bo.setUpdateUserId(SpringUtil.getSystemOperator().getUserId());
            bo.setUserId(Long.valueOf(str));
            list.add(bo);
            systemLogManageService.dataLog("userId", SystemActionLogType.DELETE, MODULE_NAME, str);
        }
        return preUserRackApi.delete(list);
    }

    @RequiresPermission(value="ROLE_PRE_USER_NATURE")
    @RequestMapping(value ="/changeUserNature", method = {  RequestMethod.POST })
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.CHANGE_NATURE)
    public ResultDto changeUserNature(UserInformation domain){
    	domain.setUpdateUserId(SpringUtil.getSystemOperator().getUserId()); 
        return preUserRackApi.changeUserNature(domain);
    }

    /**
     * 预审
     */
    @RequiresPermission(value="ROLE_PRE_USER_APPROVE")
    @RequestMapping(value = "/approve",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.APPROVE)
    public ResultDto approve(String userId){
        systemLogManageService.dataLog("userId", SystemActionLogType.APPROVE, MODULE_NAME, userId);
        return preUserRackApi.approve(userId);
    }
    /**
     * 批量预审
     */
    @RequiresPermission(value="ROLE_PRE_USER_BATCH_APPROVE")
    @RequestMapping(value = "/batchApprove",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.APPROVE)
    public ResultDto batchApprove(@RequestParam("userIds[]") String[] userIds){
        ResultDto result = new ResultDto();
        int i= 0;
        for(String str:userIds){
            result = preUserRackApi.approve(str);
            if(result.getResultCode()==0){
                i++;
            }
            systemLogManageService.dataLog("userId", SystemActionLogType.APPROVE, MODULE_NAME, str);
        }
        result.setResultMsg("预审成功数:"+i+";预审失败数:"+(userIds.length-i));
        return result;
    }
    
    /**
     * 撤销预审
     */
    @RequiresPermission(value="ROLE_PRE_USER_APPROVE")
    @RequestMapping(value = "/revokeApprove",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.REVOKEAPPROVE)
    public ResultDto revokeApprove(String userId){
        systemLogManageService.dataLog("userId", SystemActionLogType.REVOKEAPPROVE, MODULE_NAME, userId);
        return preUserRackApi.revokeApprove(userId);
    }

    /**
     * 服务信息
     * @param dto
     * @return
     */
    @RequestMapping(value = "/servicelist",method = RequestMethod.POST)
    @ResponseBody
    public PageResult<UserServiceInformationDTO> getServiceList(UserServiceInformationDTO dto){
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        PageResult<UserServiceInformationDTO> result = new PageResult<UserServiceInformationDTO>();
        try{
            result = userService.queryService(dto);
        }catch (Exception e){
            result = null;
        }
        return result;
    }

    /**
     * 带宽信息
     * @param dto
     * @return
     */
    @RequestMapping(value = "/bandwidthlist",method = RequestMethod.POST)
    @ResponseBody
    public PageResult<UserBandwidthInformationDTO> getHouseIndexData(UserBandwidthInformationDTO dto){
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        PageResult<UserBandwidthInformationDTO> result = new PageResult<UserBandwidthInformationDTO>();
        try{
            result = userBandWidthService.queryService(dto);
        }catch (Exception e){
            result = null;
        }
        return result;
    }

    /**
     * 虚拟主机
     * @param dto
     * @return
     */
    @RequestMapping(value = "/virtuallist",method = RequestMethod.POST)
    @ResponseBody
    public PageResult<UserVirtualInformationDTO> getVirtualList(UserVirtualInformationDTO dto){
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        PageResult<UserVirtualInformationDTO> result = new PageResult<UserVirtualInformationDTO>();
        try{
            result = userVirtualService.listData(dto);
        }catch (Exception e){
            result = null;
        }
        return result;
    }

    /**
     * IP地址段信息
     * @param rack
     * @return
     */
    @RequestMapping(value ="useriplist", method = {  RequestMethod.POST })
    @ResponseBody
    public PageResult<HouseIPSegmentInforDTO> queryRack(HouseIPSegmentInforDTO rack) {
        rack.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        rack.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        rack.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        return preUserRackApi.queryIpInfo(rack);
    }

}
