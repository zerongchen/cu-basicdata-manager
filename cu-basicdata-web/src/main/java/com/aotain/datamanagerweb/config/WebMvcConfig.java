package com.aotain.datamanagerweb.config;

import com.aotain.datamanagerweb.interceptor.AuthInterceptor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.*;


/**
 * @ClassName WebMvcConfig
 * @date: 2018年7月4日 上午11:29:13
 * @author tanzj
 */
@Component
public class WebMvcConfig  implements WebMvcConfigurer  {


	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new AuthInterceptor()).addPathPatterns("/**").excludePathPatterns("/static/**");
		WebMvcConfigurer.super.addInterceptors(registry);
	}


	/**
	 * 静态资源访问
	 */
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry 	registry) {
		
		 //将所有/resources/** 访问都映射到classpath:/resources/ 目录下
		registry
			.addResourceHandler("/static/**")
			.addResourceLocations("classpath:/static/");
		WebMvcConfigurer.super.addResourceHandlers(registry);

	}

	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		//registry.addViewController("/error/404").setViewName("/admin/page_error/error_404.html");
	}

}