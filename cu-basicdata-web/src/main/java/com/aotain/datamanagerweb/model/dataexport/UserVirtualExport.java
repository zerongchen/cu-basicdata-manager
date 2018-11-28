package com.aotain.datamanagerweb.model.dataexport;


import com.aotain.cu.annotation.ExpSheet;
import com.aotain.cu.annotation.Export;
import lombok.Data;

@Data
@ExpSheet(name="虚拟主机")
public class UserVirtualExport {

	private Long virtualId;
	private Long userId;

	@Export(title="*单位名称", id=1)
	private String unitName; //单位名称

	@Export(title="*机房名称", id=2)
	private String houseName;  //机房名称
	
	@Export(title="*虚拟主机编号", id=3)
	private String virtualNo;  //虚拟主机编号
	
	@Export(title="*虚拟主机名称", id=4)
	private String virtualName;  //虚拟主机名称
	
	@Export(title="*虚拟主机网络地址", id=5)
	private String netWorkAddress; //虚拟主机网络地址
	
	@Export(title="*虚拟主机管理地址", id=6)
	private String mgnAddress;  //虚拟主机管理地址
	
	@Export(title="*虚拟主机状态", id=7)
	private String virtualState;  //虚拟主机状态
	
	@Export(title="*虚拟主机类型", id=8)
	private String virtualType;  //虚拟主机类型

	@Export(title="*隶属分公司", id=9)
	private String areaCodeStr;
	

}
