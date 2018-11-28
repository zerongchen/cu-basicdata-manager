package com.aotain.datamanagerweb.mapper.isp;

import com.aotain.common.config.annotation.MyBatisDao;
import com.aotain.cu.serviceapi.model.IspModel;

import java.util.List;

@MyBatisDao
public interface IspMapper {
    List<IspModel> query( IspModel model);
    void banthImport(List<IspModel> list);
    void banthActive(List<Long> list);
    void banthInActive(List<Long> list);
    void banthdelete(List<Long> list);
}
