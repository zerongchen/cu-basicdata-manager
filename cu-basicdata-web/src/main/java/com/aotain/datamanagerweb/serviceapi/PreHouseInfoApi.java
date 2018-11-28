package com.aotain.datamanagerweb.serviceapi;

import com.aotain.cu.serviceapi.dto.HouseInformationDTO;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.BaseModel;
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
public interface PreHouseInfoApi {

    @RequestMapping(value="/serviceapi/pre/house/importHouse", method = {  RequestMethod.POST })
    List<ResultDto> importHouseData(List<HouseInformationDTO> dtoList);

//    @RequestMapping(value="/serviceapi/pre/house/synchHouse", method = {  RequestMethod.POST })
//    ResultDto synchHouse(BaseModel baseModel);

}
