package com.aotain.datamanagerweb.mapper.dic;

import com.aotain.common.config.annotation.MyBatisDao;
import com.aotain.cu.serviceapi.model.IdcJcdmXzqydm;
import com.aotain.datamanagerweb.dto.dic.AreaModel;
import com.aotain.datamanagerweb.dto.dic.AreaModelDTO;
import com.aotain.datamanagerweb.dto.dic.BaseCode;
import com.aotain.datamanagerweb.dto.dic.JyGzModel;
import com.aotain.datamanagerweb.model.ChinaArea;

import java.util.List;

@MyBatisDao
public interface DictionaryMapper {

    AreaModelDTO getAreaData();

    List<JyGzModel> getRule();

    public List<BaseCode> getBalxArr();

    public List<BaseCode> getDllxArr();

    public List<BaseCode> getDwsxArr();

    public List<BaseCode> getFwnrArr();

    public List<BaseCode> getGzlxArr();

    public List<BaseCode> getJfxzArr();

    public List<BaseCode> getJrfsArr();

    public List<BaseCode> getWfwgqkArr();

    public List<BaseCode> getZjlxArr();

    public List<BaseCode> getWzbalxArr();

    public List<BaseCode> getIpdzsyfsArr();

    public List<BaseCode> getYhbsArr();

    IdcJcdmXzqydm getXzqydmCodeByCode(String code);

    IdcJcdmXzqydm getXzqydmCodeByMC(IdcJcdmXzqydm idcJcdmXzqydm);

    IdcJcdmXzqydm getDeployProvinceCodeByCode();

	List<AreaModel> getAreaCodeList(AreaModel dto);

	int insertXZQYDM(AreaModel dto);

	int deleteXZQYDMById(long id);

	int updateXZQYDMById(AreaModel areaModel);

	int findCountByCode(AreaModel dto);

	int emptyProvince();

	int setPronvice(long parseLong);

	List<ChinaArea> getChinaAraList(ChinaArea dto);

	int insertChinaArea(ChinaArea dto);

	int updateChinaArea(ChinaArea dto);

	int finChinaAreaCountByCode(ChinaArea dto);

	int deleteChinaAreaByCode(long code);

	int finChinaAreaCountByName(ChinaArea dto);

	List<AreaModel> getAreaTreeList(AreaModel areaModel);

	int findCountByMCandParentCode(AreaModel dto);
}
