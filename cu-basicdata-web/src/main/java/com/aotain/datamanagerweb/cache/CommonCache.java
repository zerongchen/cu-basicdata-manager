package com.aotain.datamanagerweb.cache;

import com.aotain.datamanagerweb.dto.dic.AreaModelDTO;
import com.aotain.datamanagerweb.dto.dic.BaseCodeDataDto;
import com.aotain.datamanagerweb.dto.dic.JyGzModel;
import com.aotain.datamanagerweb.service.CommonService;
import com.google.common.cache.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * <P>缓存</P>
 * @author Chenzr
 * @since 2018/02/02
 */

@Component
public class CommonCache {

    private static Logger logger = LoggerFactory.getLogger(CommonCache.class);



    private static LoadingCache<String, AreaModelDTO> areaCodeCache = null;
    private static LoadingCache<String, List<JyGzModel>> jygzCache = null;
    private static LoadingCache<String, BaseCodeDataDto> baseCodeDataCache = null;


    @Autowired
    private CommonService service;

    /**
     * 刷新缓存
     */
    public void refreshCache(String method){
        try {
           Method action =  this.getClass().getMethod(method,null);
            ((LoadingCache)action.invoke(this)).invalidateAll();
        } catch (NoSuchMethodException e) {
            logger.error("",e);
        } catch (IllegalAccessException e) {
            logger.error("",e);
        } catch (InvocationTargetException e) {
            logger.error("",e);
        }
        logger.info("refresh cache success!");
    }


    /**
     * 查看缓存统计信息
     */
    public void statCache(){
        logger.info("cache stats:");
        logger.info(this.getAreaCodeCache().stats().toString());
        logger.info(this.getJyGzCache().stats().toString());
        logger.info(this.getBaseCodeDataCache().stats().toString());

    }

    public LoadingCache<String,AreaModelDTO> getAreaCodeCache(){
        if(areaCodeCache == null){
            areaCodeCache = CacheBuilder
                    .newBuilder().maximumSize(1000)
                    .expireAfterWrite(30, TimeUnit.SECONDS).recordStats()
                    .refreshAfterWrite(30, TimeUnit.SECONDS)
                    .removalListener(new RemovalListener<Object, Object>() {
                        @Override
                        public void onRemoval(RemovalNotification<Object, Object> notification) {
                            logger.info(notification.getKey() + " was removed, cause is " + notification.getCause());
                        }
                    }).build(
                            new CacheLoader<String, AreaModelDTO>() {
                        @Override
                        public AreaModelDTO load( String key) {
                            return service.getAreaData();
                        }
                    });
        }
        return areaCodeCache;
    }

    public LoadingCache<String,List<JyGzModel>> getJyGzCache(){
        if(jygzCache == null){
            jygzCache = CacheBuilder
                    .newBuilder().maximumSize(1000)
                    .expireAfterWrite(30, TimeUnit.SECONDS).recordStats()
                    .refreshAfterWrite(30, TimeUnit.SECONDS)
                    .removalListener(new RemovalListener<Object, Object>() {
                        @Override
                        public void onRemoval(RemovalNotification<Object, Object> notification) {
                            logger.info(notification.getKey() + " was removed, cause is " + notification.getCause());
                        }
                    }).build(
                            new CacheLoader<String, List<JyGzModel>>() {
                                @Override
                                public List<JyGzModel> load( String key) {
                                    return service.getRule();
                                }
                            });
        }
        return jygzCache;
    }


    public LoadingCache<String,BaseCodeDataDto> getBaseCodeDataCache(){
        if(baseCodeDataCache == null){
            baseCodeDataCache = CacheBuilder
                    .newBuilder().maximumSize(1000)
                    .expireAfterWrite(12, TimeUnit.HOURS).recordStats()
                    .refreshAfterWrite(12, TimeUnit.HOURS)
                    .removalListener(new RemovalListener<Object, Object>() {
                        @Override
                        public void onRemoval(RemovalNotification<Object, Object> notification) {
                            logger.info(notification.getKey() + " was removed, cause is " + notification.getCause());
                        }
                    }).build(
                            new CacheLoader<String, BaseCodeDataDto>() {
                                @Override
                                public BaseCodeDataDto load( String key) {
                                    return service.getBaseCodeData();
                                }
                            });
        }
        return baseCodeDataCache;
    }

}
