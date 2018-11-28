package com.aotain.datamanagerweb.service.userservice;

import com.aotain.cu.serviceapi.dto.AjaxValidationResult;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.dto.UserBandwidthInformationDTO;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.cu.serviceapi.model.UserBandwidthInformation;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

/**
 * @ClassName UserBandWidthService
 * @Author tanzj
 * @Date 2018/7/25
 **/
@FeignClient(value="serviceapi")
@Component
public interface UserBandWidthService {

    @RequestMapping(value = "/serviceapi/pre/user/bandwidth/query",method = RequestMethod.POST)
    public PageResult<UserBandwidthInformationDTO> queryService(UserBandwidthInformationDTO service);

    @RequestMapping(value = "/serviceapi/pre/user/bandwidth/validate",method = RequestMethod.POST)
    public AjaxValidationResult validateService(UserBandwidthInformationDTO service);

    @RequestMapping(value = "/serviceapi/pre/user/bandwidth/insert",method = RequestMethod.POST)
    public ResultDto insertService(List<UserBandwidthInformationDTO> service);

    @RequestMapping(value = "/serviceapi/pre/user/bandwidth/update",method = RequestMethod.POST)
    public ResultDto updateService(List<UserBandwidthInformationDTO> list);

    @RequestMapping(value = "/serviceapi/pre/user/bandwidth/delete",method = RequestMethod.POST)
    public ResultDto deleteService(List<UserBandwidthInformationDTO> list);


}
