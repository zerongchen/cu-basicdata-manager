package com.aotain.datamanagerweb.service.userservice;

import com.aotain.cu.serviceapi.dto.AjaxValidationResult;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.dto.UserVirtualInformationDTO;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.cu.serviceapi.model.UserVirtualInformation;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

/**
 * Demo class
 *
 * @author bang
 * @date 2018/08/10
 */
@FeignClient(value="serviceapi")
@Component
public interface UserVirtualService {

    @RequestMapping(value = "/serviceapi/pre/user/virtual/query",method = RequestMethod.POST)
    PageResult<UserVirtualInformationDTO> listData(UserVirtualInformationDTO dto);

    @RequestMapping(value = "/serviceapi/pre/user/virtual/delete",method = RequestMethod.POST)
    ResultDto deleteVirtuals(List<UserVirtualInformation> bandWidths);

    @RequestMapping(value = "/serviceapi/pre/user/virtual/validate",method = RequestMethod.POST)
    AjaxValidationResult validateService(UserVirtualInformationDTO dto);

    @RequestMapping(value = "/serviceapi/pre/user/virtual/insert",method = RequestMethod.POST)
    ResultDto insertVirtual(List<UserVirtualInformation> dto);

    @RequestMapping(value = "/serviceapi/pre/user/virtual/update",method = RequestMethod.POST)
    ResultDto updateVirtual(List<UserVirtualInformation> bandWidths);

}
