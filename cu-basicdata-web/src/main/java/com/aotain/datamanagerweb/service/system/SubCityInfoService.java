package com.aotain.datamanagerweb.service.system;


import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.datamanagerweb.model.ChinaArea;

public interface SubCityInfoService {

	PageResult<ChinaArea> getHouseLinkInfoList(ChinaArea dto);

	boolean isExistChinaAreaCode(ChinaArea dto);

	boolean isExistChinaAreaName(ChinaArea dto);

	ResultDto insert(String params, HttpServletRequest request);

	ResultDto update(ChinaArea dto, HttpServletRequest request);
	
	ResultDto deleteByIds(List<Long> idList, HttpServletRequest request);

	Boolean insertChinaAreaToPassport(HttpServletRequest request);
}
