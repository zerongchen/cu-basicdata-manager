package com.aotain.datamanagerweb.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 用于保存数据库连接池相关的属性
 *
 * @author daiyh
 * @date 2018/07/03
 */
@Configuration
@ConfigurationProperties(prefix = "spring.datasource.primary")
@Getter
@Setter
public class DataSourcePropertiesHolder {
    @Value("url")
    private String url;
    @Value("username")
    private String username;
    @Value("password")
    private String password;
    @Value("driver-class-name")
    private String driverClassName;
    @Value("${spring.datasource.primary.test-while-idle}")
    private Boolean testWhileIdle;
    @Value("${spring.datasource.primary.test-on-borrow}")
    private Boolean testOnBorrow;
    @Value("${spring.datasource.primary.test-on-return}")
    private Boolean testOnReturn;
    @Value("validation-query")
    private String validationQuery;
    @Value("${spring.datasource.primary.time-between-eviction-runs-millis}")
    private Long timeBetweenEvictionRunsMills;
    @Value("${spring.datasource.primary.min-evictable-idle-time-millis}")
    private Long minEvictableIdleTimeMillis;
    @Value("${spring.datasource.primary.initial-size}")
    private Integer initialSize;
    @Value("${spring.datasource.primary.max-active}")
    private Integer maxActive;
    @Value("${spring.datasource.primary.max-wait}")
    private Long maxWait;
    @Value("${spring.datasource.primary.min-idle}")
    private Integer minIdle;
}
