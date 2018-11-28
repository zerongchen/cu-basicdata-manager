package com.aotain.datamanagerweb.utils;

import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.datamanagerweb.annotation.LogAction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.Map;

/**
 * 代理工具类，通过代理修改日志注解内容
 *
 * @author bang
 * @date 2018/11/22
 */
public class ProxyUtil {

    private static final Logger logger = LoggerFactory.getLogger(ProxyUtil.class);

    public static String methodName = "";

    /**
     * 修改指定clz,指定方法中指定内容
     * @param clz
     * @param methodName
     * @param dataJson
     * @throws Exception
     */
    public static void changeVariable(Class clz,String methodName,String dataJson) {
        changeVariable(clz,methodName,dataJson,"");
    }

    public static void changeVariable(Class clz,String methodName,String dataJson,String description) {
        changeVariable(clz, methodName, dataJson, description,null,null);
    }

    public static void changeVariable( Class clz, String methodName, String dataJson, String description, String module, SystemActionLogType operationType) {
        try{
            Method[] methods = clz.getMethods();
            Method targetMethod = null;
            for (Method method:methods){
                if (method.getName().equals(methodName)){
                    targetMethod = method;
                    ProxyUtil.methodName = methodName;
                }
            }

            LogAction logAnnotation = targetMethod.getAnnotation(LogAction.class);
            //获取 foo 这个代理实例所持有的 InvocationHandler
            InvocationHandler h = Proxy.getInvocationHandler(logAnnotation);
            // 获取 AnnotationInvocationHandler 的 memberValues 字段
            Field hField = h.getClass().getDeclaredField("memberValues");
            // 修改field访问权限
            hField.setAccessible(true);
            // 获取 memberValues
            Map memberValues = (Map) hField.get(h);
            // 修改需要改变属性值
            memberValues.put("dataJson", dataJson);
            memberValues.put("description",description);
            //可修改module的值
            if(module!=null){
                memberValues.put("module",module);
            }
            if (operationType!=null){
                memberValues.put("type",operationType.ordinal());
            }
        } catch (Exception e){

        }


    }
}
