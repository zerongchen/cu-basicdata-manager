package com.aotain.datamanagerweb.interceptor;


import com.aotain.datamanagerweb.annotation.RequiresPermission;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Enumeration;


/**
 * 用户权限拦截器
 *
 * @author
 * @Date 2017年9月5日
 */
public class AuthInterceptor extends HandlerInterceptorAdapter {

    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler)
            throws Exception {

        RequiresPermission requiresPermission = ((HandlerMethod) handler).getMethodAnnotation(RequiresPermission.class);

        if (requiresPermission != null) {

            HttpSession httpSession = request.getSession();
            String[] permissions = requiresPermission.value();
            boolean flag = false;
            for (String permission : permissions) {
                if(httpSession.getAttribute(permission)!=null && String.valueOf(httpSession.getAttribute(permission)).equalsIgnoreCase("1")){
                    flag = true;
                    break ;
                }
            }

            if(!flag){
                response.sendRedirect(request.getContextPath() + "/nopermission");
                return false;
            }
        }
        return true;
    }

/*    public void postHandle(HttpServletRequest request, HttpServletResponse response,
                           Object handler, ModelAndView modelAndView)
            throws Exception {
        HttpSession httpSession = request.getSession();
        Enumeration<String> permissionStrs = httpSession.getAttributeNames();
        while(permissionStrs.hasMoreElements());

    }*/

    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex)
            throws Exception {
        // TODO Auto-generated method stub

    }

}
