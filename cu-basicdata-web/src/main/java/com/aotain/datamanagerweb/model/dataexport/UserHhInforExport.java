package com.aotain.datamanagerweb.model.dataexport;


import com.aotain.cu.annotation.ExpSheet;
import com.aotain.cu.annotation.Export;
import lombok.Data;

@ExpSheet(name="带宽信息")
@Data
public class UserHhInforExport {

	private Long hhId;

	private Long userId;

	@Export(title="*单位名称", id=1)
	private String unitName;   //用户编码
	
	@Export(title="*机房名称", id=2)
	private String houseName;   //机房名称
	
	@Export(title="*资源分配日期", id=3)
	private String distributeTime; //资源分配时间，采用yyyy-MM-dd的格式
	
	@Export(title="网络带宽(Mbps)", id=4)
	private Long bandWidth; //网络带宽（单位：Mbps)

	@Export(title="*隶属分公司", id=5)
	private String areaCodeStr; // 隶属单位地市码
	
}
