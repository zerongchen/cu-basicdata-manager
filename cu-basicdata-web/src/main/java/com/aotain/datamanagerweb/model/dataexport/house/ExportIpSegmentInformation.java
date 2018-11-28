package com.aotain.datamanagerweb.model.dataexport.house;

import com.aotain.common.config.ContextUtil;
import com.aotain.common.config.redis.BaseRedisService;
import com.aotain.cu.annotation.ExpSheet;
import com.aotain.cu.annotation.Export;
import com.aotain.datamanagerweb.constant.JCDMConstant;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;

/**
 * Demo class
 *
 * @author bang
 * @date 2018/08/21
 */
@Data
@ExpSheet(name="机房IP地址段信息")
public class ExportIpSegmentInformation {

    private BaseRedisService<String,String,String> baseRedisService = ContextUtil.getContext().getBean(BaseRedisService.class);

    private Long ipSegId;

    @Export(title="机房名称", id=1)
    private String houseName;

    @Export(title="起始IP地址", id=2)
    private String startIP;

    @Export(title="终止IP地址", id=3)
    private String endIP;

//    @Export(title="IP地址使用方式", id=4)
    private Integer ipType;

    @Export(title="IP地址使用方式", id=4)
    private String ipTypeStr;

    @Export(title="使用人的单位名称", id=5)
    private String userName;

    @Export(title="分配使用日期", id=6)
    private String useTime;

    @Export(title="隶属分公司", id=7)
    private String areaCode;

    private String areaCodeName;

    public void setIpType(Integer ipType){
        this.ipType = ipType;

        String tableName = JCDMConstant.IDC_JCDM_IPDZSYFS;
        String result = baseRedisService.getHash(tableName+":"+ipType,"MC");
        if (result!=null){
            ipTypeStr = ipType+"-"+result;
        }
    }

    public void setAreaCode(String areaCode){
        if (!StringUtils.isEmpty(getAreaCodeName())){
            this.areaCode = areaCode+"-"+getAreaCodeName();
        } else {
            this.areaCode = areaCode;
        }
    }
}
