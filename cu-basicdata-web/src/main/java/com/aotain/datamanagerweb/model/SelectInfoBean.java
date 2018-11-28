package com.aotain.datamanagerweb.model;

import java.util.List;

public class SelectInfoBean  extends TitleValueBean{

    private String houseName;
    private String unitName;
    private long userId;
    private long houseId;
    private Integer nature;
    private String areaCodes;
    private List<String> userAuthIdentityList;
    private String authIdentities;
    private Integer setMode;
    
    

	public Integer getSetMode() {
		return setMode;
	}

	public void setSetMode(Integer setMode) {
		this.setMode = setMode;
	}

	public String getAuthIdentities(){return authIdentities;}

	public void setAuthIdentities(String authIdentities){ this.authIdentities=authIdentities;}

	public String getAreaCodes() {
		return areaCodes;
	}

	public void setAreaCodes(String areaCodes) {
		this.areaCodes = areaCodes;
	}

	public List<String> getUserAuthIdentityList() {
		return userAuthIdentityList;
	}

	public void setUserAuthIdentityList(List<String> userAuthIdentityList) {
		this.userAuthIdentityList = userAuthIdentityList;
	}

	public String getHouseName() {
        return houseName;
    }

    public void setHouseName(String houseName) {
        this.houseName = houseName;
    }

    public String getUnitName() {
        return unitName;
    }

    public void setUnitName(String unitName) {
        this.unitName = unitName;
    }

	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}

	public long getHouseId() {
		return houseId;
	}

	public void setHouseId(long houseId) {
		this.houseId = houseId;
	}

	public Integer getNature() {
		return nature;
	}

	public void setNature(Integer nature) {
		this.nature = nature;
	}
    
	
    
}
