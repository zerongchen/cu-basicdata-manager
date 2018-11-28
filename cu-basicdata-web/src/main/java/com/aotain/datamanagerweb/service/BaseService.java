package com.aotain.datamanagerweb.service;

import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.datamanagerweb.constant.ImportConstant;
import com.aotain.datamanagerweb.model.FileImportResult;
import com.aotain.datamanagerweb.model.dataexport.UserInforExport;


public abstract class BaseService {

    /**
     * 获取成功返回结果
     * @return
     */
    public ResultDto getSuccessResult( String msg){
        ResultDto resultDto = new ResultDto();
        resultDto.setResultCode(ResultDto.ResultCodeEnum.SUCCESS.getCode());
        resultDto.setResultMsg(msg);
        return resultDto;
    }

    /**
     * 获取成功返回结果
     * @return
     */
    public ResultDto getSuccessResult( Integer pid){
        ResultDto resultDto = new ResultDto();
        resultDto.setResultCode(ResultDto.ResultCodeEnum.SUCCESS.getCode());
        resultDto.setPid(pid);
        return resultDto;
    }

    /**
     * 获取成功返回结果
     * @return
     */
    public ResultDto getSuccessResult(){
        ResultDto resultDto = new ResultDto();
        resultDto.setResultCode(ResultDto.ResultCodeEnum.SUCCESS.getCode());
        resultDto.setResultMsg("success");
        return resultDto;
    }

    /**
     * 返回失败结果
     * @return
     */
    public ResultDto getErrorResult(){
        ResultDto resultDto = new ResultDto();
        resultDto.setResultCode(ResultDto.ResultCodeEnum.ERROR.getCode());
        resultDto.setResultMsg("error");
        return resultDto;
    }

    /**
     * 返回失败结果
     * @return
     */
    public ResultDto getErrorResult( String msg){
        ResultDto resultDto = new ResultDto();
        resultDto.setResultCode(ResultDto.ResultCodeEnum.ERROR.getCode());
        resultDto.setResultMsg(msg);
        return resultDto;
    }


    /**
     * 返回导入失败状态
     * @return
     */
    public FileImportResult getImportError(){
        FileImportResult result = new FileImportResult();
        result.setStatus(ImportConstant.StatusEum.IMPORT_FAIL.getType());
        return result;
    }

    /**
     * 返回正在导入状态
     * @return
     */
    public FileImportResult getImportingResult( String percent){
        FileImportResult result = new FileImportResult();
        result.setStatus(ImportConstant.StatusEum.IMPORTING.getType());
        result.setPercent(percent);
        return result;
    }

    /**
     * 返回导入成功状态
     * @return
     */
    public FileImportResult getImportSucResult( String errorFile){
        FileImportResult result = new FileImportResult();
        result.setStatus(ImportConstant.StatusEum.IMPORT_SUCCESS.getType());
        result.setErrorFileName(errorFile);
        result.setPercent("100%");
        return result;
    }



}
