package com.aotain.datamanagerweb.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * Demo class
 *
 * @author bang
 * @date 2018/10/19
 */
@Configuration
@Getter
@Setter
public class AuthConstantProperty {

    @Value("${service.local.deployid}")
    private String appId;

    @Value("${service.local.dataPermissionUrl}")
    private String dataPermissionUrl;
}
