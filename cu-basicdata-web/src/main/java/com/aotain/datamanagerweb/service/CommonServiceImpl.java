package com.aotain.datamanagerweb.service;

import com.aotain.cu.serviceapi.dto.HouseFrameInformationDTO;
import com.aotain.cu.serviceapi.model.*;
import com.aotain.datamanagerweb.dto.dic.AreaModelDTO;
import com.aotain.datamanagerweb.dto.dic.BaseCodeDataDto;
import com.aotain.datamanagerweb.dto.dic.JyGzModel;
import com.aotain.datamanagerweb.mapper.CommonMapper;
import com.aotain.datamanagerweb.mapper.dic.DictionaryMapper;
import com.aotain.datamanagerweb.model.AreaCodeQueryDto;
import com.aotain.datamanagerweb.model.BaseUserInfo;
import com.aotain.datamanagerweb.model.SelectInfoBean;
import com.aotain.datamanagerweb.serviceapi.PreIdcInfoApi;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.common.base.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service(value="commonService")
public class CommonServiceImpl implements CommonService{

    @Autowired
    private CommonMapper commonMapper;

    @Autowired
    private DictionaryMapper codeMapper;

    @Autowired
    private PreIdcInfoApi preIdcInfoApi;

    @Override
    public List<SelectInfoBean> getHouseSelectInfo(SelectInfoBean domain) {
        return commonMapper.getHouseSelectInfo(domain);
    }

    @Override
    public List<SelectInfoBean> getIDCHouseSelectInfo(SelectInfoBean domain) {
        return commonMapper.getIDCHouseSelectInfo(domain);
    }

    @Override
    public List<SelectInfoBean> getUserSelectInfo(SelectInfoBean domain) {
        return commonMapper.getUserSelectInfo(domain);
    }

    @Override
    public AreaModelDTO getAreaData() {
        AreaModelDTO sss = codeMapper.getAreaData();
        return sss;
    }

    @Override
    public List<JyGzModel> getRule() {
        return codeMapper.getRule();
    }

    @Override
    public BaseCodeDataDto getBaseCodeData() {
        BaseCodeDataDto baseData = new BaseCodeDataDto();
        baseData.setBalxArr(codeMapper.getBalxArr());
        baseData.setDllxArr(codeMapper.getDllxArr());
        baseData.setDwsxArr(codeMapper.getDwsxArr());
        baseData.setFwnrArr(codeMapper.getFwnrArr());
        baseData.setGzlxArr(codeMapper.getGzlxArr());
        baseData.setJfxzArr(codeMapper.getJfxzArr());
        baseData.setJrfsArr(codeMapper.getJrfsArr());
        baseData.setWfwgqkArr(codeMapper.getWfwgqkArr());
        baseData.setZjlxArr(codeMapper.getZjlxArr());
        baseData.setWzbalxArr(codeMapper.getWzbalxArr());
        baseData.setIpdzsyfsArr(codeMapper.getIpdzsyfsArr());
        baseData.setYhbsArr(codeMapper.getYhbsArr());
        return baseData;
    }

    @Override
    public List<SelectInfoBean> getSubOrdAreaAreaCode(AreaCodeQueryDto queryDto) {
        if(queryDto.getAreaCodes()==null || "".equals(queryDto.getAreaCodes())){
            return null;
        }
        List<String> queryList = new ArrayList();
        List<String> list = new ArrayList<>();
        queryList = Arrays.asList(queryDto.getAreaCodes().split(","));
        if(queryDto.getHouseId()!=null){
            String houseCode = commonMapper.getAreaCodeByHouseId(queryDto.getHouseId());
            if(!Strings.isNullOrEmpty(houseCode)){
                list = Arrays.asList(houseCode.split(","));
                List temList = new ArrayList(list);
                temList.retainAll(queryList);
                queryList = temList;
            }else {
                return null;}
        }

        if(queryDto.getUserId()!=null){
            String userCode = commonMapper.getAreaCodeByUserId(queryDto.getUserId());
            if(!Strings.isNullOrEmpty(userCode)){
                list = Arrays.asList(userCode.split(","));
                List temList = new ArrayList(list);
                temList.retainAll(queryList);
                queryList = temList;
            }else {
                return null;
            }
        }

        if(queryList==null || queryList.size()<=0){
            return new ArrayList<SelectInfoBean>();
        }
        List<SelectInfoBean> resList = commonMapper.getSubOrdArea(queryList);
        if(resList!=null){
            return resList;
        }else{
            return new ArrayList<SelectInfoBean>();
        }

    }

    @Override
    public List<SelectInfoBean> getSubOrdArea() {
        List<String> queryList = new ArrayList<>();
        return commonMapper.getSubOrdArea(queryList);
    }

    @Override
    public IdcJcdmXzqydm getXzqydmCodeByCode(String code) {
        return codeMapper.getXzqydmCodeByCode(code);
    }

    @Override
    public List<SelectInfoBean> getUnitNameList() {
        return commonMapper.getUnitNameList();
    }

	@Override
	public String getAreaCodeByHouseId(long houseId) {
		return commonMapper.getAreaCodeByHouseId(houseId);
	}

	public List<HouseUserFrameInformation> listUserFrame(HouseFrameInformationDTO dto) {
		return commonMapper.listUserFrame(dto);
	}

	@Override
	public String getAreaByUserId(long userId) {
		return commonMapper.getAreaCodeByUserId(userId);
	}

    @Override
    public List<BaseUserInfo> getUserNames(BaseModel dto) {
        List<BaseUserInfo> info = new ArrayList<BaseUserInfo>();
        PageHelper.startPage(dto.getPageIndex(), dto.getPageSize());
        info =  commonMapper.getUserNames(dto);
        PageInfo<BaseUserInfo> pageResult = new PageInfo<BaseUserInfo>(info);
        return info;
    }

    @Override
    public List<SelectInfoBean> getUserSubAreaCode(List<String> query) {
        return commonMapper.getSubOrdArea(query);
    }

    @Override
    public String existIdc() {
        PageResult<IdcInformation> jyz = preIdcInfoApi.listIdcInfo();
        if(jyz.getRows().size()<=0){
            return "0";
        }
        return "1";
    }


}
