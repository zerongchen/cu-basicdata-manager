package com.aotain.datamanagerweb.service.houseinfo;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.aotain.cu.serviceapi.dto.AjaxValidationResult;
import com.aotain.cu.serviceapi.dto.HouseGatewayInformationDTO;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.PageResult;

@FeignClient(value="serviceapi")
@Component
public interface HouseLinkInfoServiceApi {

	@RequestMapping(value = "/serviceapi/pre/house/link/query",method = RequestMethod.POST)
	PageResult<HouseGatewayInformationDTO> getHouseLinkInfoList(HouseGatewayInformationDTO dto);

	@RequestMapping(value = "/serviceapi/pre/house/link/insert",method = RequestMethod.POST)
	//ResultDto insert(HouseGatewayInformationDTO dto);
	ResultDto insert(List<HouseGatewayInformationDTO> links);

	@RequestMapping(value = "/serviceapi/pre/house/link/delete",method = RequestMethod.POST)
	ResultDto delete(List<HouseGatewayInformationDTO> links);

	@RequestMapping(value = "/serviceapi/pre/house/link/update",method = RequestMethod.POST)
	ResultDto update(List<HouseGatewayInformationDTO> links);

	@RequestMapping(value = "/serviceapi/pre/house/link/validate",method = RequestMethod.POST)
	AjaxValidationResult validate(HouseGatewayInformationDTO dto);

}
