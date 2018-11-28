package com.aotain.datamanagerweb.service.userservice;

import com.aotain.cu.serviceapi.dto.*;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.cu.serviceapi.model.UserServiceInformation;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

/**
 * @ClassName HouseInfomationService
 * @Author tanzj
 * @Date 2018/7/25
 **/
@FeignClient(value="serviceapi")
@Component
public interface UserServiceService {

    @RequestMapping(value = "/serviceapi/pre/user/service/query",method = RequestMethod.POST)
    public PageResult<UserServiceInformationDTO> queryService(UserServiceInformationDTO service);

    @RequestMapping(value = "/serviceapi/pre/user/service/validate",method = RequestMethod.POST)
    public AjaxValidationResult validateService(UserServiceInformationDTO service);

    @RequestMapping(value = "/serviceapi/pre/user/service/insert",method = RequestMethod.POST)
    public ResultDto insertService(List<UserServiceInformationDTO> service);

    @RequestMapping(value = "/serviceapi/pre/user/service/update",method = RequestMethod.POST)
    public ResultDto updateService(List<UserServiceInformationDTO> service);

    @RequestMapping(value = "/serviceapi/pre/user/service/delete",method = RequestMethod.POST)
    public ResultDto deleteService(List<UserServiceInformationDTO> serviceIds);

}
