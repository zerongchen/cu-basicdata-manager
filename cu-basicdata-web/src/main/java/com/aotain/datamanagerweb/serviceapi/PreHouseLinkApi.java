package com.aotain.datamanagerweb.serviceapi;

import com.aotain.cu.serviceapi.dto.HouseGatewayInformationDTO;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.HouseIPSegmentInformation;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

/**
 * Demo class
 *
 * @author bang
 * @date 2018/08/22
 */
@FeignClient(value="serviceapi")
@Component
public interface PreHouseLinkApi {

    @RequestMapping(value="/serviceapi/pre/house/importHouseLink", method = {  RequestMethod.POST })
    List<ResultDto> importHouseLink(List<HouseGatewayInformationDTO> dtoList);

}
