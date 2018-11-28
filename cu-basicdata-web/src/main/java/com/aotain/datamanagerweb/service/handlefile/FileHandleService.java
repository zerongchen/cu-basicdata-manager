package com.aotain.datamanagerweb.service.handlefile;

import com.aotain.cu.serviceapi.dto.HouseInformationDTO;
import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.dto.UserInformationDTO;
import com.aotain.cu.serviceapi.model.ImportTaskModel;
import com.aotain.datamanagerweb.constant.HouseImportTaskModel;
import com.aotain.datamanagerweb.model.FileImportResult;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface FileHandleService {

    void exportTemplate( HttpServletRequest request, HttpServletResponse response, String fileName,String exportName );

    ResultDto handIdcImport( HttpServletRequest request, ImportTaskModel model );
    ResultDto handUserImport( HttpServletRequest request, ImportTaskModel model );

    /**
     * 机房信息导入
     * @param request
     * @param model
     * @return
     */
    ResultDto handHouseImport( HttpServletRequest request, HouseImportTaskModel model );

    FileImportResult getImportProcess( Long userId,Integer type);

    void exportUserErrorFile(HttpServletRequest request, HttpServletResponse response, String fileName );
    void exportIspErrorFile(HttpServletRequest request, HttpServletResponse response, String fileName );
    void exportIdcErrorFile(HttpServletRequest request, HttpServletResponse response, String fileName );
    void exportHouseErrorFile(HttpServletRequest request, HttpServletResponse response, String fileName );

    void exportUserData( HttpServletRequest request,HttpServletResponse response, UserInformationDTO dto );

    void exportHouseData( HttpServletRequest request,HttpServletResponse response, HouseInformationDTO dto );

    /**
     * 上报用户信息导出
     * @param request
     * @param response
     * @param dto
     */
    public void exportRptUserData( HttpServletRequest request, HttpServletResponse response, UserInformationDTO dto);
    void exportRptHouseData( HttpServletRequest request,HttpServletResponse response, HouseInformationDTO dto );
}
