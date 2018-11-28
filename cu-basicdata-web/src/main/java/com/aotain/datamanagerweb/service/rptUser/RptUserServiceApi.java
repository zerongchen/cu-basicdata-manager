package com.aotain.datamanagerweb.service.rptUser;

import com.aotain.cu.serviceapi.dto.*;
import com.aotain.cu.serviceapi.model.PageResult;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 用户上报查询接口
 */
@FeignClient(value="serviceapi")
@Component
public interface RptUserServiceApi {


    @RequestMapping(value = "/serviceapi/report/user/service/query", method = { RequestMethod.POST })
    public PageResult<UserServiceInformationDTO> queryUserService(UserServiceInformationDTO dto);
    
    @RequestMapping(value = "/serviceapi/report/user/virtual/query", method = { RequestMethod.POST })
    public PageResult<UserVirtualInformationDTO> queryUserVirtual(UserVirtualInformationDTO dto);

    @RequestMapping(value = "/serviceapi/report/user/bandWidth/query", method = { RequestMethod.POST })
    public PageResult<UserBandwidthInformationDTO> queryUserHH(UserBandwidthInformationDTO dto);

    @RequestMapping(value = "/serviceapi/report/house/ipSegment/query",method = RequestMethod.POST)
    public PageResult<HouseIPSegmentInforDTO> queryUserIp(HouseIPSegmentInforDTO dto);

    @RequestMapping(value = "/serviceapi/report/user/listUserInfo",method = RequestMethod.POST)
    public PageResult<UserInformationDTO> queryUserInfo(UserInformationDTO dto);

}
