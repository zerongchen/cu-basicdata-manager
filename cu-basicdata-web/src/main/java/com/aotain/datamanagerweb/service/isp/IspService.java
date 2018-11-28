package com.aotain.datamanagerweb.service.isp;

import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.IspModel;
import com.aotain.cu.serviceapi.model.PageResult;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface IspService {
    PageResult<IspModel> query( IspModel model);
    ResultDto banthImport( HttpServletRequest request);
    ResultDto banthActive(List<Long> list);
    ResultDto banthInActive(List<Long> list);
    ResultDto banthdelete(List<Long> list);
}
