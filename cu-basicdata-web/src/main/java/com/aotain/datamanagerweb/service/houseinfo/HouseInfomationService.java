package com.aotain.datamanagerweb.service.houseinfo;

import com.aotain.cu.serviceapi.dto.*;
import com.aotain.cu.serviceapi.model.HouseInformation;
import com.aotain.cu.serviceapi.model.PageResult;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestBody;
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
public interface HouseInfomationService {

    @RequestMapping(value = "/serviceapi/pre/house/listHouseInfo",method = RequestMethod.POST)
    public PageResult<HouseInformationDTO> getHouseIndexData(@RequestBody HouseInformationDTO dto);

    @RequestMapping(value = "/serviceapi/pre/house/validate",method = RequestMethod.POST)
    public AjaxValidationResult preValidate(HouseInformationDTO dto);

    @RequestMapping(value = "/serviceapi/pre/house/ipSegment/validate",method = RequestMethod.POST)
    public ResultDto preIpValidate(List<HouseIPSegmentInforDTO> dto);

    @RequestMapping(value = "/serviceapi/pre/house/rack/validate",method = RequestMethod.POST)
    public ResultDto preFramValidate(List<HouseFrameInformationDTO> dto);

    @RequestMapping(value = "/serviceapi/pre/house/link/validate",method = RequestMethod.POST)
    public ResultDto preLinkValidate(List<HouseGatewayInformationDTO> dto);

    @RequestMapping(value = "/serviceapi/pre/house/insert",method = RequestMethod.POST)
    public List<ResultDto> save(List<HouseInformation> list);

    @RequestMapping(value = "/serviceapi/pre/house/update",method = RequestMethod.POST)
    public List<ResultDto> update(List<HouseInformation> list);

    @RequestMapping(value = "/serviceapi/pre/house/getDetail",method = RequestMethod.POST)
    public HouseInformationDTO getHouseDetail(Integer dto);

    @RequestMapping(value = "/serviceapi/pre/house/ipSegment/query",method = RequestMethod.POST)
    public PageResult<HouseIPSegmentInforDTO> getHouseIPDetailData(HouseIPSegmentInforDTO dto);

    @RequestMapping(value = "/serviceapi/pre/house/rack/query",method = RequestMethod.POST)
    public PageResult<HouseFrameInformationDTO> getHouseFrameDetail(HouseFrameInformationDTO dto);

    @RequestMapping(value = "/serviceapi/pre/house/link/query",method = RequestMethod.POST)
    public PageResult<HouseGatewayInformationDTO> getHouseLinkDetail(HouseGatewayInformationDTO dto);

    @RequestMapping(value = "/serviceapi/pre/house/approve",method = RequestMethod.POST)
    public ResultDto preJudHouse(String houseIds);

    @RequestMapping(value = "/serviceapi/pre/house/revertApprove",method = RequestMethod.POST)
    public ResultDto revertApprove(String houseIds);

    @RequestMapping(value = "/serviceapi/pre/house/delete",method = RequestMethod.POST)
    public ResultDto delete(List<HouseInformationDTO> deleteList);

    @RequestMapping(value = "/serviceapi/pre/house/findCheckResult",method = RequestMethod.POST)
    public List<ApproveResultDto> findCheckResult(String approveId);
    
    @RequestMapping(value = "/serviceapi/common/getReportFileInfo",method = RequestMethod.POST)
    public PageResult<ReportFile> getReportFileInfo(String submitId);
}
