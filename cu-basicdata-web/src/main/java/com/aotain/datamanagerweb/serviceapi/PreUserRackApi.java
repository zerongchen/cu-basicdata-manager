package com.aotain.datamanagerweb.serviceapi;

import com.aotain.cu.serviceapi.dto.*;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.cu.serviceapi.model.UserInformation;
import feign.RequestLine;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

@FeignClient(value="serviceapi")
@Component
public interface PreUserRackApi {


    @RequestMapping(value="/serviceapi/pre/user/approve", method = {  RequestMethod.POST })
    ResultDto approve(@RequestParam(value="userId") String userId);

    @RequestMapping(value="/serviceapi/pre/user/delete", method = {  RequestMethod.POST })
    ResultDto delete(List<UserInformationDTO> dtos);

    @RequestMapping(value="/serviceapi/pre/user/userValidateMsg", method = {  RequestMethod.POST })
    List<ApproveResultDto> userValidateMsg(String approveId);

    @RequestMapping(value="/serviceapi/pre/user/changeUserNature", method = {  RequestMethod.POST })
    ResultDto changeUserNature( UserInformation domain );

    @RequestMapping(value="/serviceapi/pre/user/insert", method = {  RequestMethod.POST })
    List<ResultDto> insert( List<UserInformationDTO> rack );

    @RequestMapping(value="/serviceapi/pre/user/update", method = {  RequestMethod.POST })
    List<ResultDto> update( List<UserInformationDTO> rack );

    @RequestMapping(value="/serviceapi//pre/user/validate", method = {  RequestMethod.POST })
    AjaxValidationResult validate( UserInformationDTO rack );

    @RequestMapping(value="/serviceapi//pre/user/service/validate", method = {  RequestMethod.POST })
    AjaxValidationResult serviceValidate( UserServiceInformationDTO rack );

    @RequestMapping(value="/serviceapi//pre/user/bandwidth/validate", method = {  RequestMethod.POST })
    AjaxValidationResult bandwidthValidate( UserBandwidthInformationDTO rack );

    @RequestMapping(value="/serviceapi//pre/user/virtual/validate", method = {  RequestMethod.POST })
    AjaxValidationResult virtualValidate( UserVirtualInformationDTO rack );

    @RequestMapping(value="/serviceapi/pre/user/listUserInfo", method = {  RequestMethod.POST })
	PageResult<UserInformationDTO> listUserInfo(UserInformationDTO dto);
    @RequestMapping(value="/serviceapi/pre/user/importUser", method = {  RequestMethod.POST })
    Map<Integer,ResultDto> importUser( Map<Integer,UserInformationDTO> rack);

    @RequestMapping(value="/serviceapi/pre/user/importUserService", method = {  RequestMethod.POST })
    Map<Integer,ResultDto> importUserService( Map<Integer,UserServiceInformationDTO> rack );

    @RequestMapping(value="/serviceapi/pre/user/importUserBand", method = {  RequestMethod.POST })
    Map<Integer,ResultDto> importUserBand( Map<Integer,UserBandwidthInformationDTO> rack );

    @RequestMapping(value="/serviceapi/pre/user/importUserVir", method = {  RequestMethod.POST })
    Map<Integer,ResultDto> importUserVir(Map<Integer,UserVirtualInformationDTO> rack);

    @RequestMapping(value = "/serviceapi/pre/house/ipSegment/query", method = { RequestMethod.POST })
    PageResult<HouseIPSegmentInforDTO> queryIpInfo(HouseIPSegmentInforDTO rack);

    @RequestMapping(value="/serviceapi/pre/user/revertApprove", method = {  RequestMethod.POST })
	ResultDto revokeApprove(@RequestBody String userId);

    /**
     * 修改用户带宽信息
     *
     * @param bandwidth
     * @return
     */
    @RequestMapping(value="/serviceapi/pre/user/bandwidth/update", method = {  RequestMethod.POST })
    ResultDto updateBandwidth(List<UserBandwidthInformationDTO> bandwidth);
}
