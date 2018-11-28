package com.aotain.datamanagerweb.serviceapi;

import com.aotain.cu.serviceapi.dto.AjaxValidationResult;
import com.aotain.cu.serviceapi.dto.HouseFrameInformationDTO;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.HouseFrameInformation;
import com.aotain.cu.serviceapi.model.PageResult;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(value="serviceapi")
@Component
public interface PreHouseRackApi {

    @RequestMapping(value = "/serviceapi/pre/house/rack/query", method = { RequestMethod.POST })
    PageResult<HouseFrameInformationDTO> queryRack(HouseFrameInformationDTO rack);

    @RequestMapping(value="/serviceapi/pre/house/rack/insert", method = {  RequestMethod.POST })
    ResultDto insert(List<HouseFrameInformationDTO> list);

    @RequestMapping(value="/serviceapi/pre/house/rack/update", method = {  RequestMethod.POST })
    ResultDto update(List<HouseFrameInformationDTO> list);

    @RequestMapping(value="/serviceapi/pre/house/rack/validate", method = {  RequestMethod.POST })
    AjaxValidationResult validate(HouseFrameInformationDTO rack);

    @RequestMapping(value="/serviceapi/pre/house/rack/delete", method = {  RequestMethod.POST })
    ResultDto delete(List<HouseFrameInformationDTO> list);

    @RequestMapping(value="/serviceapi/pre/house/importHouseFrame", method = {  RequestMethod.POST })
    List<ResultDto> importHouseFrame(List<HouseFrameInformationDTO> houseFrameInformationDTOList);
}
