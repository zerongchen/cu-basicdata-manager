package com.aotain.datamanagerweb.auth;

import com.aotain.cu.auth.AuthQuery;
import com.aotain.cu.auth.ResponseData;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Demo class
 *
 * @author bang
 * @date 2018/11/20
 */
@FeignClient(value = "serviceapi")
@Component
public interface AuthRemoteClient {
    /**
     * 调用认证,获取token
     * @param query
     * @return
     */
    @RequestMapping(value = "/serviceapi/oauth/token", method = {  RequestMethod.POST })
    ResponseData auth(@RequestBody AuthQuery query);
}
