package com.aotain.datamanagerweb.controller.userinfo;

import com.aotain.cu.serviceapi.dto.HouseIPSegmentInforDTO;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.datamanagerweb.annotation.LogAction;
import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.datamanagerweb.service.system.SystemLogManageService;
import com.aotain.datamanagerweb.serviceapi.PreHouseIPSegmentApi;

import com.aotain.datamanagerweb.utils.SpringUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Component
@Controller
@RequestMapping(value = "/userIp")
public class UserIpInfoController {
	
	private static final String MODULE_NAME = "用户IP";

    private Logger log = LoggerFactory.getLogger(UserIpInfoController.class);

    @Autowired
    private PreHouseIPSegmentApi preHouseIPSegmentApi;

    @Autowired
    private SystemLogManageService systemLogManageService;
    /**
     * 首页加载
     * @return
     */
    @RequestMapping(value = "/index",method = RequestMethod.GET)
    public String getIndex(){
        return "/userIp/index";
    }

    /**
     * 首页查询
     * @param dto
     * @return
     */
    @RequestMapping(value = "/userIPlist",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.READ)
    public PageResult<HouseIPSegmentInforDTO> getUserIPInfoList(HouseIPSegmentInforDTO dto){
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        PageResult<HouseIPSegmentInforDTO> result = new PageResult<HouseIPSegmentInforDTO>();
        try{
            result = preHouseIPSegmentApi.query(dto);
        }catch (Exception e){
            result = null;
            log.error("get service fail",e);
        }
        return result;
    }

}
