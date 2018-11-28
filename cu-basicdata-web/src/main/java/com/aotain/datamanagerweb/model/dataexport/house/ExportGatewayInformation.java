package com.aotain.datamanagerweb.model.dataexport.house;

import com.aotain.cu.annotation.ExpSheet;
import com.aotain.cu.annotation.Export;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;

/**
 * Demo class
 *
 * @author bang
 * @date 2018/08/21
 */
@Data
@ExpSheet(name="机房链路信息")
public class ExportGatewayInformation {

    private Long gatewayId;

    @Export(title="机房名称", id=1)
    private String houseName;

    @Export(title="链路编号", id=2)
    private String linkNo;

    @Export(title="机房互联网出入口带宽(Mbps)", id=3)
    private Long bandWidth;

    @Export(title="机房出入口网关IP地址", id=4)
    private String gatewayIP;

    private String areaCodeName;

    @Export(title="隶属分公司", id=5)
    private String areaCode;

    public void setAreaCode(String areaCode){
        if (!StringUtils.isEmpty(getAreaCodeName())){
            this.areaCode = areaCode+"-"+getAreaCodeName();
        } else {
            this.areaCode = areaCode;
        }
    }
}
