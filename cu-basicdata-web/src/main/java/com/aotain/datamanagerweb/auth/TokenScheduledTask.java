package com.aotain.datamanagerweb.auth;

import com.aotain.cu.auth.AuthQuery;
import com.aotain.cu.auth.ResponseData;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 用于定期获取token
 *
 * @author bang
 * @date 2018/11/20
 */
@Component
public class TokenScheduledTask {
    private static Logger logger = LoggerFactory.getLogger(TokenScheduledTask.class);

    public final static long HALF_HOUR = 1000 * 60 *30 ;

    @Autowired
    private AuthRemoteClient authRemoteClient;

    /**
     * 刷新Token
     */
    @Scheduled(fixedDelay = HALF_HOUR)
    public void reloadApiToken() {
        String token = this.getToken();
        while (StringUtils.isBlank(token)) {
            try {
                Thread.sleep(1000);
                token = this.getToken();
            } catch (InterruptedException e) {
                logger.error("", e);
            }
        }
        System.setProperty("serviceapi.auth.token", token);
    }

    public String getToken() {
        AuthQuery query = new AuthQuery();
        query.setAccessKey("admin123");
        query.setSecretKey("1qaz@WSX");
        ResponseData response = authRemoteClient.auth(query);
        return response.getData() == null ? "" : response.getData().toString();
    }
}
