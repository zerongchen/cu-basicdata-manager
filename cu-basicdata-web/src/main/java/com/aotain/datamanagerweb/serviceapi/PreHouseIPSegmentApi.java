package com.aotain.datamanagerweb.serviceapi;

import com.aotain.cu.serviceapi.dto.AjaxValidationResult;
import com.aotain.cu.serviceapi.dto.HouseIPSegmentInforDTO;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.PageResult;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(value="serviceapi")
@Component
public interface PreHouseIPSegmentApi {

    @RequestMapping(value = "/serviceapi/pre/house/ipSegment/query", method = { RequestMethod.POST })
    PageResult<HouseIPSegmentInforDTO> query(HouseIPSegmentInforDTO rack);

    @RequestMapping(value="/serviceapi/pre/house/ipSegment/insert", method = {  RequestMethod.POST })
    ResultDto insert(List<HouseIPSegmentInforDTO> list);

    @RequestMapping(value="/serviceapi/pre/house/ipSegment/update", method = {  RequestMethod.POST })
    ResultDto update(List<HouseIPSegmentInforDTO> ipSegmentInforDTOs);

    @RequestMapping(value="/serviceapi/pre/house/ipSegment/validate", method = {  RequestMethod.POST })
    AjaxValidationResult validate(HouseIPSegmentInforDTO rack);

    @RequestMapping(value="/serviceapi/pre/house/ipSegment/delete", method = {  RequestMethod.POST })
    ResultDto delete(List<HouseIPSegmentInforDTO> ipSegments);

    @RequestMapping(value="/serviceapi/pre/house/importHouseIpSeg", method = {  RequestMethod.POST })
    List<ResultDto> importHouseIpSeg(List<HouseIPSegmentInforDTO> houseIPSegmentInforDTOS);
}
