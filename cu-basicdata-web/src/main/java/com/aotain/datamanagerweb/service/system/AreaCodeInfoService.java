package com.aotain.datamanagerweb.service.system;


import java.util.List;

import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.datamanagerweb.dto.dic.AreaModel;

public interface AreaCodeInfoService {

	/**
	 * 列表查询行政区域代码
	 * 
	 */
	PageResult<AreaModel> getAreaCodeInfoList(AreaModel areaModel);

	/**
	 * 
	 * 新增行政区域代码
	 */
	ResultDto insertXZQYDM(String params);

	/**
	 * 
	 * 根据Id删除新增区域代码信息
	 */
	ResultDto deleteByIds(List<Long> idList);

	/**
	 * 
	 * 根据Id修改行政区域代码信息
	 * 
	 */
	ResultDto updateById(AreaModel areaModel);

	/**
	 * 加载区域管理树信息
	 * @param areaModel 
	 * 
	 */
	List<Object> listSourArea(AreaModel areaModel);

	/**
	 * 
	 * 是否存在相同的区域编码
	 * @param dto 
	 */
	boolean isExistXZQYDMByCode(AreaModel dto);

	/**
	 * 
	 * 根据code部署省份
	 */
	Boolean setPronvice(String code);

	/**
	 * 是否存在一个区域下有相同的地市名称
	 * 
	 */
	boolean isExistXZQYDMByMCAndParentCode(AreaModel dto);

	
}
