package com.aotain.datamanagerweb.model.dataexport.house;

import com.aotain.common.config.ContextUtil;
import com.aotain.common.config.redis.BaseRedisService;
import com.aotain.cu.annotation.ExpSheet;
import com.aotain.cu.annotation.Export;
import com.aotain.cu.serviceapi.model.HouseUserFrameInformation;
import com.aotain.datamanagerweb.constant.JCDMConstant;
import com.aotain.datamanagerweb.mapper.dic.DictionaryMapper;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

/**
 * Demo class
 *
 * @author bang
 * @date 2018/08/21
 */
@Data
@ExpSheet(name="机房机架信息")
public class ExportHouseFrameInformation {

    private BaseRedisService<String,String,String> baseRedisService = ContextUtil.getContext().getBean(BaseRedisService.class);

    private Long frameId;

    @Export(title="机房名称", id=1)
    private String houseName;

    @Export(title="机架名称", id=2)
    private String frameName;

    @Export(title="占用状态", id=3)
    private String occupancyStr;

    @Export(title="使用类型", id=4)
    private String useTypeStr;

    @Export(title="同一机架被多客户使用（散户柜）", id=5)
    private String unitNames;

    private String areaCodeName;

    @Export(title="隶属分公司", id=6)
    private String areaCode;

    private List<HouseUserFrameInformation> userFrameList;

    public void setOccupancyStr(String occupancyStr){
        String tableName = JCDMConstant.IDC_JCDM_ZYLX;
        String result = baseRedisService.getHash(tableName+":"+occupancyStr,"MC");
        if (result!=null){
            occupancyStr = occupancyStr+"-"+result;
        }
        this.occupancyStr = occupancyStr;
    }

    public void setUseTypeStr(String useTypeStr){
        String tableName = JCDMConstant.IDC_JCDM_SYLX;
        String result = baseRedisService.getHash(tableName+":"+useTypeStr,"MC");
        if (result!=null){
            useTypeStr = useTypeStr+"-"+result;
        }
        this.useTypeStr = useTypeStr;
    }

    public void setAreaCode(String areaCode){
        if (!StringUtils.isEmpty(getAreaCodeName())){
            this.areaCode = areaCode+"-"+getAreaCodeName();
        } else {
            this.areaCode = areaCode;
        }
    }
}
