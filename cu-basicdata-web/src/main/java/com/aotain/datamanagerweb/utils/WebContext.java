package com.aotain.datamanagerweb.utils;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.springframework.web.context.ServletContextAware;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * webContext上下文帮助类， 实现ServletContextAware接口，主要为了从servletContext中获取
 * webAppRoot,webApplicationContext上下文等信息
 * <p>
 * 注意次方法只能用于WEB环境，非Web环境建议使用{@link com.aotain.isms.utils.SpringContextTool}
 * </p>
 * @author yinzf
 * @createtime 2014年9月30日 下午3:30:34
 */
public class WebContext implements ServletContextAware {

	public static WebApplicationContext webApplicationContext;

	@Override
	public void setServletContext(ServletContext servletContext) {
		webApplicationContext = WebApplicationContextUtils.getWebApplicationContext(servletContext);
	}

	/**
	 * Spring获取bean的快捷方法，
	 * <p>
	 * 注意次方法只能用于WEB环境，非Web环境建议使用
	 * {@link org.smart.support.spring.SpringContextUtils} getBean(String
	 * name)方法
	 * </p>
	 * 
	 * @param name
	 *            bean名称
	 * @return
	 */
	public static Object getBean(String name) {
		return webApplicationContext.getBean(name);
	}
	
	public static boolean containsBean(String name) {
		return webApplicationContext!=null&&webApplicationContext.containsBean(name);
	}

	/**
	 * 获取当前的web请求
	 * @return
	 */
	public static HttpServletRequest getCurrentRequest() {
		return ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
	}
	
	/**
	 * 获取客户端IP地址
	 * @return
	 */
	public static String getRequestIp(){
		HttpServletRequest request = getCurrentRequest();
		return request.getRemoteAddr();
	}
	
	/**
	 * 获取客户端IP地址及端口
	 * @return 
	 */
	public static String getRequestIpAndPort(){
		try {
			HttpServletRequest request = getCurrentRequest(); 
			String ip = request.getRemoteAddr();
			int port = request.getRemotePort();
			return ip + ":" + port;
		} catch (Exception e) {
			return ""; 
		}
	}
	
//	public static String getIpAddr() {
//		HttpServletRequest request = getCurrentRequest();
//        String ip = request.getHeader("x-forwarded-for");
//        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
//            ip = request.getHeader("Proxy-Client-IP");
//        }
//        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
//            ip = request.getHeader("WL-Proxy-Client-IP");
//        }
//        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
//            ip = request.getRemoteAddr();
//        }
//        return ip;
//    }
//	
//	public static String getHost(){
//		HttpServletRequest request = getCurrentRequest();
//		return request.getRemoteHost();
//	}
	
}
