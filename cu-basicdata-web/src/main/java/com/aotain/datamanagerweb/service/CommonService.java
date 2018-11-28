package com.aotain.datamanagerweb.service;

import com.aotain.cu.serviceapi.model.BaseModel;
import com.aotain.cu.serviceapi.model.IdcJcdmXzqydm;
import com.aotain.datamanagerweb.dto.dic.AreaModelDTO;
import com.aotain.datamanagerweb.dto.dic.BaseCodeDataDto;
import com.aotain.datamanagerweb.dto.dic.JyGzModel;
import com.aotain.datamanagerweb.model.AreaCodeQueryDto;
import com.aotain.datamanagerweb.model.BaseUserInfo;
import com.aotain.datamanagerweb.model.SelectInfoBean;

import java.util.List;

public interface CommonService {

    List<SelectInfoBean> getHouseSelectInfo(SelectInfoBean domain);
    List<SelectInfoBean> getIDCHouseSelectInfo(SelectInfoBean domain);
    List<SelectInfoBean> getUserSelectInfo(SelectInfoBean domain);
    AreaModelDTO getAreaData();
    List<JyGzModel> getRule();

    public BaseCodeDataDto getBaseCodeData();

    List<SelectInfoBean> getSubOrdArea();

    List<SelectInfoBean> getSubOrdAreaAreaCode(AreaCodeQueryDto queryDto);

    IdcJcdmXzqydm getXzqydmCodeByCode(String code);

    List<SelectInfoBean> getUnitNameList();
    
	String getAreaCodeByHouseId(long parseLong);
	String getAreaByUserId(long parseLong);

	List<BaseUserInfo> getUserNames(BaseModel dto);

	List<SelectInfoBean> getUserSubAreaCode(List<String> list);

	String existIdc();
}
