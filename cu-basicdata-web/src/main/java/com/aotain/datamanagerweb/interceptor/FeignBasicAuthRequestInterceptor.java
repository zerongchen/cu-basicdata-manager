package com.aotain.datamanagerweb.interceptor;

import com.aotain.cu.auth.RibbonFilterContextHolder;
import feign.RequestInterceptor;
import feign.RequestTemplate;

import java.util.Map;

/**
 * Demo class
 *
 * @author bang
 * @date 2018/11/20
 */
public class FeignBasicAuthRequestInterceptor implements RequestInterceptor {

    public FeignBasicAuthRequestInterceptor() {

    }

    @Override
    public void apply(RequestTemplate template) {
        template.header("Authorization", System.getProperty("serviceapi.auth.token"));
        Map<String, String> attributes =
                RibbonFilterContextHolder.getCurrentContext().getAttributes();
        for (String key :  attributes.keySet()) {
            String value = attributes.get(key);
            System.out.println("feign :" + key + "\t" + value);
            template.header(key, value);
        }
    }

}
