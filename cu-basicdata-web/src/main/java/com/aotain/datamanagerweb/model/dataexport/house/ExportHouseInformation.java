package com.aotain.datamanagerweb.model.dataexport.house;

import com.aotain.common.config.ContextUtil;
import com.aotain.common.config.redis.BaseRedisService;
import com.aotain.cu.annotation.ExpSheet;
import com.aotain.cu.annotation.Export;
import com.aotain.cu.serviceapi.model.HouseFrameInformation;
import com.aotain.cu.serviceapi.model.HouseGatewayInformation;
import com.aotain.cu.serviceapi.model.HouseIPSegmentInformation;
import com.aotain.datamanagerweb.constant.JCDMConstant;
import lombok.Data;

import java.util.List;

/**
 * Demo class
 *
 * @author bang
 * @date 2018/08/21
 */
@Data
@ExpSheet(name="机房主体信息")
public class ExportHouseInformation {

    private BaseRedisService<String,String,String> baseRedisService = ContextUtil.getContext().getBean(BaseRedisService.class);

    private Long houseId;

    @Export(title = "机房编号(与设备定义机房ID一致)", id = 1)
    private String houseIdStr;

    @Export(title = "机房名称", id = 2)
    private String houseName;

    @Export(title="专线标识", id=3)
    private String identifyStr;

    @Export(title="机房性质", id=4)
    private String houseTypeStr;

    // TODO
    @Export(title="市级名称", id=5)
    private String cityName;

    // TODO
    @Export(title="区级名称", id=6)
    private String countyName;

    @Export(title = "机房地址", id = 7)
    private String houseAddress;

    private String houseZipCode;

    @Export(title = "网络信息安全责任人姓名", id = 8)
    private String houseOfficerName;

//    @Export(title = "网络信息安全责任人证件类型", id = 9)
    private Integer  houseOfficerIdType;

    @Export(title = "网络信息安全责任人证件类型", id = 9)
    private String  houseOfficerIdTypeStr;

    @Export(title = "网络信息安全责任人证件号码", id = 10)
    private String houseOfficerId;

    @Export(title = "网络信息安全责任人固定电话", id = 11)
    private String houseOfficerTelephone;

    @Export(title = "网络信息安全责任人移动电话", id = 12)
    private String houseOfficerMobile;

    @Export(title = "网络信息安全责任人Email", id = 13)
    private String houseOfficerEmail;

//    @Export(title="隶属分公司", id=14)
    private String areaCode;

    public void setIdentifyStr(String identifyStr){
        String tableName = JCDMConstant.IDC_JCDM_ZXBS;
        String result = baseRedisService.getHash(tableName+":"+identifyStr,"MC");
        if (result!=null){
            identifyStr = identifyStr+"-"+result;
        }
        this.identifyStr = identifyStr;
    }

    public void setHouseTypeStr(String houseTypeStr){
        String tableName = JCDMConstant.IDC_JCDM_JFXZ;
        String result = baseRedisService.getHash(tableName+":"+houseTypeStr,"MC");
        if (result!=null){
            houseTypeStr = houseTypeStr+"-"+result;
        }
        this.houseTypeStr = houseTypeStr;
    }

    public void setHouseOfficerIdType(Integer houseOfficerIdType){
        this.houseOfficerIdType = houseOfficerIdType;

        String tableName = JCDMConstant.IDC_JCDM_ZJLX;
        String result = baseRedisService.getHash(tableName+":"+houseOfficerIdType,"MC");
        if (result!=null){
            houseOfficerIdTypeStr = houseOfficerIdType+"-"+result;
        }
    }

    private List<ExportIpSegmentInformation> ipSegList;
    private List<ExportHouseFrameInformation> frameList;
    private List<ExportGatewayInformation> gatewayInfoList;
}
