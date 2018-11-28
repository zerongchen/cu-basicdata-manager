package com.aotain.datamanagerweb.service.isp;

import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.IspModel;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.datamanagerweb.mapper.isp.IspMapper;
import com.aotain.datamanagerweb.service.BaseService;
import com.aotain.datamanagerweb.utils.ExcelUtil;
import com.aotain.datamanagerweb.utils.SpringUtil;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
public class IspServiceImpl extends BaseService implements IspService {

    private Logger logger = LoggerFactory.getLogger(IspServiceImpl.class);
    @Autowired
    private IspMapper ispMapper;

    @Override
    public PageResult<IspModel> query( IspModel model ) {

        PageResult<IspModel> result = new PageResult<IspModel>();
        List<IspModel> info ;
        if(model.getIsPaging().equals(1)){
            PageHelper.startPage(model.getPageIndex(), model.getPageSize());
            info = ispMapper.query(model);
            PageInfo<IspModel> pageResult = new PageInfo<IspModel>(info);
            result.setTotal(pageResult.getTotal());
        }else{
            info = ispMapper.query(model);
        }
        result.setRows(info);
        return result;
    }

    @Override
    @Transactional
    public ResultDto banthImport(HttpServletRequest request) {

        try {
            Collection<Part> parts  = request.getParts();
            Iterator<Part> iterator = parts.iterator();
            if (iterator.hasNext()){
                Part part = iterator.next();
                String fileName =part.getSubmittedFileName();
                InputStream stream = part.getInputStream();
                System.out.println("----流-------->"+stream);
                System.out.println("----名-------->"+fileName);
                Map<Integer, Map<Integer, String[]>> map = ExcelUtil.readExcelFromStream(stream);
                if (map==null || map.values().isEmpty()) return getErrorResult("文件为空");
                IspValidator validator = getIspValidator(fileName);
                return validator.validateAndWrite(map);
            }
        } catch (IOException e) {
            logger.error("parse file error",e);
        } catch (ServletException e) {
            logger.error("parse file error",e);
        }
         return getErrorResult();
    }

    @Override
    @Transactional
    public ResultDto banthActive( List<Long> list ) {
        ispMapper.banthActive(list);
        return getSuccessResult("过滤单位上报成功！");
    }

    @Override
    @Transactional
    public ResultDto banthInActive( List<Long> list ) {
        ispMapper.banthInActive(list);
        return getSuccessResult("取消单位上报成功！");
    }

    @Override
    @Transactional
    public ResultDto banthdelete( List<Long> list ) {
        ispMapper.banthdelete(list);
        return getSuccessResult("删除成功");
    }

    private IspValidator getIspValidator(String name){
        IspValidator ispValidator = SpringUtil.getBean(IspValidator.class);
        ispValidator.setFileName(name);
        return ispValidator;
    }

}
