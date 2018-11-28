package com.aotain.datamanagerweb.mapper;

import com.aotain.common.config.annotation.MyBatisDao;
import com.aotain.cu.serviceapi.dto.HouseFrameInformationDTO;
import com.aotain.cu.serviceapi.model.BaseModel;
import com.aotain.cu.serviceapi.model.HouseUserFrameInformation;
import com.aotain.datamanagerweb.model.BaseUserInfo;
import com.aotain.datamanagerweb.model.SelectInfoBean;

import java.util.List;

@MyBatisDao
public interface CommonMapper {

    List<SelectInfoBean> getHouseSelectInfo(SelectInfoBean domain);
    List<SelectInfoBean> getIDCHouseSelectInfo(SelectInfoBean domain);
    List<SelectInfoBean> getUserSelectInfo(SelectInfoBean domain);
    List<SelectInfoBean> getSubOrdArea(List<String> list);
    List<SelectInfoBean> getUnitNameList();
	String getAreaCodeByHouseId(long houseId);
    String getAreaCodeByUserId(long userId);
	List<HouseUserFrameInformation> listUserFrame(HouseFrameInformationDTO dto);
	List<BaseUserInfo> getUserNames(BaseModel dto);
}
