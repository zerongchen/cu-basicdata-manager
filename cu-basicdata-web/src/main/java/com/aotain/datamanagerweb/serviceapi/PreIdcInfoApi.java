package com.aotain.datamanagerweb.serviceapi;

import com.aotain.cu.serviceapi.dto.AjaxValidationResult;
import com.aotain.cu.serviceapi.dto.ApproveResultDto;
import com.aotain.cu.serviceapi.dto.IDCInformationDTO;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.IdcInformation;
import com.aotain.cu.serviceapi.model.PageResult;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

@FeignClient(value="serviceapi")
@Component
public interface PreIdcInfoApi {

    @RequestMapping(value = "/serviceapi/pre/idcinfo/listIdcInfo", method = { RequestMethod.POST })
    PageResult<IdcInformation> listIdcInfo();

    @RequestMapping(value = "/serviceapi/pre/idcinfo/checkIdcExsist", method = { RequestMethod.POST })
    boolean checkIdcExsist();

    @RequestMapping(value="/serviceapi/pre/idcinfo/insert", method = {  RequestMethod.POST })
    ResultDto insert(IdcInformation idcInformation);

    @RequestMapping(value="/serviceapi/pre/idcinfo/update", method = {  RequestMethod.POST })
    ResultDto update(IdcInformation idcInformation);

    @RequestMapping(value="/serviceapi/pre/idcinfo/validate", method = {  RequestMethod.POST })
    AjaxValidationResult validate(IDCInformationDTO idcInformation);

    @RequestMapping(value="/serviceapi/pre/idcinfo/delete", method = {  RequestMethod.POST })
    ResultDto delete(@RequestParam(value="jyzId") Integer jyzId);

    @RequestMapping(value="/serviceapi/pre/idcinfo/preValidate", method = {  RequestMethod.POST })
    ResultDto preValidate(@RequestParam(value="jyzId") Integer jyzId);

    @RequestMapping(value="/serviceapi/pre/idcinfo/revokeValid", method = {  RequestMethod.POST })
    ResultDto revokeValid(@RequestParam(value="jyzId") Integer jyzId);

    @RequestMapping(value="/serviceapi/pre/idcinfo/preValidateCascade", method = {  RequestMethod.POST })
    ResultDto preValidateCascade(@RequestParam(value="jyzId") Integer jyzId);

    @RequestMapping(value="/serviceapi/pre/idcinfo/idcValidateMsg", method = {  RequestMethod.POST })
    List<ApproveResultDto> idcValidateMsg(String approveId);
}
