package com.aotain.datamanagerweb.config;

import com.aotain.datamanagerweb.config.security.SecurityPermitAllConfig;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;


/**
 * 相当于web.xml文件
 * @author DongBoye
 * @since 2017-10-17
 */

public class MvcWebApplicationInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
	
	 /**                                   
     * 应用程序上下文配置文件，可以是多个，即相当于多个xml文件配置
     * @return
     */
	@Override
	protected Class<?>[] getRootConfigClasses() {
		System.out.println(MvcWebApplicationInitializer.class.getName()+": invoke --- getRootConfigClasses()");
		return new Class[] { SecurityPermitAllConfig.class };
	}

	 /**
     * 获取应用程序上下文配置文件
     * 如果所有配置已经在AppConfig中配置，则可以设为null
     * @return
     */
	@Override
	protected Class<?>[] getServletConfigClasses() {
		System.out.println(MvcWebApplicationInitializer.class.getName()+": invoke --- getServletConfigClasses()");
		return null;
	}
	
	/**
     * 指定拦截路径
     * @return
     */
	@Override
	protected String[] getServletMappings() {
		System.out.println(MvcWebApplicationInitializer.class.getName()+": invoke --- getServletMappings()");
		return new String[]{"/"};
	}

}
