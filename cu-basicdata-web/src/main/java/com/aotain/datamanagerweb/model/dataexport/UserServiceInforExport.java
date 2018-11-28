package com.aotain.datamanagerweb.model.dataexport;


import com.aotain.cu.annotation.ExpSheet;
import com.aotain.cu.annotation.Export;
import lombok.Data;

import java.util.List;

@ExpSheet(name="服务信息")
@Data
public class UserServiceInforExport implements Cloneable {

	private Long serviceId;
	private Long userId;

	@Export(title="*单位名称", id=1)
	private String unitName; //单位名称
	
	@Export(title="*服务内容", id=2)
	private String serviceContent;  //服务内容
	
//	@Export(title="*应用服务类型", id=3)
	private String serviceType;  //服务类型
	
	@Export(title="*业务类型", id=3)
	private String business;  //业务类型
	
	@Export(title="*域名", id=4)
	private String domainName;  //域名
	
	@Export(title="*网站备案类型", id=5)
	private String regType; // 网站备案类型
	
	@Export(title="*备案号或许可证号", id=6)
	private String regId;  //备案号或许可证号
	
	@Export(title="*接入方式", id=7)
	private String setMode;  //接入方式

	@Export(title="*隶属分公司", id=8)
	private String areaCodeStr; // 隶属单位地市码

	List<String> domains;


}
