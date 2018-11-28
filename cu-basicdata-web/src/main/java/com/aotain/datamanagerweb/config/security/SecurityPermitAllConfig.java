package com.aotain.datamanagerweb.config.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * Demo class
 *
 * @author daiyh
 * @date 2018/07/03
 */
@Configuration
public class SecurityPermitAllConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.csrf().disable();
        http.headers().frameOptions().sameOrigin().httpStrictTransportSecurity().disable()//spring boot配置iframe同源可访问
                .and().antMatcher("*.js,*.gif,*.jpg,*.bmp,*.png,*.css,*.ico,/druid/*").authorizeRequests().anyRequest().fullyAuthenticated()
                .and().authorizeRequests().antMatchers("/home").permitAll()
                .and().authorizeRequests().antMatchers("/login").permitAll()
                .and().formLogin().loginPage("/dealLogin").permitAll()
//			.usernameParameter("username").passwordParameter("password")
                .and().logout().permitAll();
    }

    //配置Spring Security的Filter链
    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/");
    }

}
