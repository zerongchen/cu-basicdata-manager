package com.aotain.datamanagerweb.mapper.task;

import com.aotain.common.config.annotation.MyBatisDao;
import com.aotain.cu.serviceapi.dto.UserBandwidthInformationDTO;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * /**
 * Created by chenym@aotain.com on 2018-09-25 16:29.
 */
@MyBatisDao
public interface UserImportTaskMapper {
    @Select({"select * from idc_isms_base_user_hh h4 " +
            " where h4.userid=(select h1.userid from idc_isms_base_user h1 where 1=1 <if test='userName!=null'> and h1.unitname=#{userName}) </if> <if test='idType!=null and idNumber!=null'> and h1.IDTYPE=#{idType} and h1.IDNUMBER=#{idNumber} </if> " +
            " and h4.houseid=(select h2.houseid from idc_isms_base_house h2 where h2.housename=#{houseName}) "})
    UserBandwidthInformationDTO getUserBindInfoByHouseIdAndUserId( @Param("houseName") String houseName, @Param("userName") String userName , @Param("idType") Integer idType ,@Param("idNumber") String idNumber);
}
