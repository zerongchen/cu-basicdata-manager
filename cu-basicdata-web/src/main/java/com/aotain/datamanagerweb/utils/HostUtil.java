package com.aotain.datamanagerweb.utils;

import java.net.InetAddress;
import java.net.UnknownHostException;


public class HostUtil {

    /**
     * 获取当前系统的主机名
     * @return
     * @throws UnknownHostException
     */
    public static String getLocalHost() {
        try {
            InetAddress address = InetAddress.getLocalHost();
            return address.getHostAddress();
        }catch (UnknownHostException e) {
            return "";
        }
    }
}
