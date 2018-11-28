package com.aotain.datamanagerweb.mapper.export;

import com.aotain.common.config.annotation.MyBatisDao;
import com.aotain.cu.serviceapi.dto.HouseInformationDTO;
import com.aotain.cu.serviceapi.model.HouseInformation;
import com.aotain.datamanagerweb.model.dataexport.house.ExportHouseInformation;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;
import java.util.Map;

/**
 * Demo class
 *
 * @author bang
 * @date 2018/08/21
 */
@MyBatisDao
public interface HouseExportMapper {
    /**
     * 查询导出数据
     * @param dto
     * @return
     */
    List<ExportHouseInformation> getExportData(HouseInformationDTO dto);
    List<ExportHouseInformation> getExportDataRpt(HouseInformationDTO dto);

    String getHouseIdByHouseName(String houseName);

    HouseInformationDTO getHouseIdAndIdentify(String houseName);
}
