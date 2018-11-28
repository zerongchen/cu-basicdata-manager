package com.aotain.datamanagerweb.model.dataexport;

import com.aotain.cu.annotation.ExpSheet;
import com.aotain.cu.annotation.Export;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@ExpSheet(name="用户主体信息")
public class UserInforExport {

	private Long userId;

	@Export(title="*单位名称", id=1)
	private String unitName; //单位名称
	
	@Export(title="*用户属性", id=2)
	private String nature; // 用户属性

	@Export(title="用户标识", id=3)
	private String identify; // 用户标识
	
	@Export(title="*单位属性", id=4)
	private String unitNature; //单位属性
	
	@Export(title="*单位的证件类型", id=5)
	private String idType; //证件类型
	
	@Export(title="*证件号码", id=6)
	private String idNumber; //证件号码

	@Export(title="*省（自治区）", id=7)
	private String unitAddressProvinceName; // 单位地址-省份名称

	@Export(title="*市（自治州|地区|盟）直辖市、县、省行政单位", id=8)
	private String unitAddressCityName; // 单位地址-市级名称

	@Export(title = "区（市|县|旗）",id=9)
	private String unitAddressAreaName;

	private String unitAddressProvinceCode; // 单位地址-省份下拉框

	private String unitAddressCityCode; // 单位地址-市级下拉框

	private String unitAddressAreaCode; // 单位地址-县级下拉框

	@Export(title="*单位地址", id=10)
	private String unitAddress; //单位地址

	@Export(title="*注册日期", id=11)
	private String registeTime; //注册时间
	
	@Export(title="*服务开通日期", id=12)
	private String serviceRegTime; // 服务开通时间
	
	@Export(title="*网络信息安全责任人姓名", id=13)
	private String officerName; //网络信息安全责任人-人员姓名
	
	@Export(title="*网络信息安全责任人证件类型", id=14)
	private String officerIdType; //网络信息安全责任人-人员的证件类型

	@Export(title="*网络信息安全责任人证件号码", id=15)
	private String officerId; //网络信息安全责任人-对应的证件号码
	
	@Export(title="*网络信息安全责任人固定电话", id=16)
	private String officerTelphone; //网络信息安全责任人-固定电话
	
	@Export(title="*网络信息安全责任人移动电话", id=17)
	private String officerMobile; //网络信息安全责任人-移动电话
	
	@Export(title="*网络信息安全责任人Email", id=18)
	private String officerEmail; //网络信息安全责任人-email地址

	@Export(title="隶属分公司", id=19)
	private String areaCodeStr; // 隶属单位地市码

	List<UserServiceInforExport> serviceList;
	List<UserHhInforExport> bandwidthList;
	List<UserVirtualExport> virtualList;

	//	用户帐号的地市信息
	private List<String> cityCodeList = new ArrayList<String>();
	//用户账号携带的隶属码信息，逗号分隔的
	private String areaCodes;
	//	用户帐号的机房信息
	private List<String> userAuthHouseList = new ArrayList<String>();
	// 用户账号携带的机房信息，逗号分隔的
	private String authHouses;
	//	用户帐号的专线标识信息
	private List<String> userAuthIdentityList = new ArrayList<String>();
	// 用户账号携带的专线机标识信息，逗号分隔的
	private String authIdentities;

}
