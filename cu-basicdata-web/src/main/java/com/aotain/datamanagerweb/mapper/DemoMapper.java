package com.aotain.datamanagerweb.mapper;

import com.aotain.common.config.annotation.MyBatisDao;
import com.aotain.datamanagerweb.model.AppType;
import com.aotain.datamanagerweb.model.Demo;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Demo class
 *
 * @author daiyh
 * @date 2018/07/03
 */
@MyBatisDao
public interface DemoMapper {
/*    @Select("SELECT * FROM zf_dict_apptype ")
    List<AppType> findAllAppType();

    @Select("SELECT * FROM DEMO ")
    List<Demo> oracleFind();

    List<Demo> findList();*/
}
