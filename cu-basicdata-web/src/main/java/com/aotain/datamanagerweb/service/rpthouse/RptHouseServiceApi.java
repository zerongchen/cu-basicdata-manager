package com.aotain.datamanagerweb.service.rpthouse;

import com.aotain.cu.serviceapi.dto.HouseFrameInformationDTO;
import com.aotain.cu.serviceapi.dto.HouseGatewayInformationDTO;
import com.aotain.cu.serviceapi.dto.HouseIPSegmentInforDTO;
import com.aotain.cu.serviceapi.dto.HouseInformationDTO;
import com.aotain.cu.serviceapi.model.PageResult;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * @ClassName RptHouseServiceApi
 * @Author tanzj
 * @Date 2018/8/10
 **/
@FeignClient(value="serviceapi")
@Component
public interface RptHouseServiceApi {


    @RequestMapping(value = "/serviceapi/report/house/listHouseInfo", method = { RequestMethod.POST })
    PageResult<HouseInformationDTO> listHouseInfo(HouseInformationDTO dto);

    @RequestMapping(value = "/serviceapi/report/house/getDetail", method = { RequestMethod.POST })
    HouseInformationDTO getDetail(@RequestParam(value = "houseId")String houseId);

    /**
     * ip地址查询
     * @param dto
     * @return
     */
    @RequestMapping(value = "/serviceapi/report/house/ipSegment/query",method = RequestMethod.POST)
    public PageResult<HouseIPSegmentInforDTO> preIpQuery(HouseIPSegmentInforDTO dto);

    /**
     * 机架查询
     * @param dto
     * @return
     */
    @RequestMapping(value = "/serviceapi/report/house/rack/query",method = RequestMethod.POST)
    public PageResult<HouseFrameInformationDTO> preFramQuery(HouseFrameInformationDTO dto);

    /**
     * 链路查询
     * @param dto
     * @return
     */
    @RequestMapping(value = "/serviceapi/report/house/link/query",method = RequestMethod.POST)
    public PageResult<HouseGatewayInformationDTO> preLinkQuery(HouseGatewayInformationDTO dto);

}
