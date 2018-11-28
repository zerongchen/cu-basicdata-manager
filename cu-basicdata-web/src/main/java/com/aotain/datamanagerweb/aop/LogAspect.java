package com.aotain.datamanagerweb.aop;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.aotain.datamanagerweb.annotation.LogAction;
import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.datamanagerweb.service.system.SystemLogManageService;
import com.aotain.login.support.Authority;

import java.lang.reflect.Method;
import java.util.Date;


/**
 * 基于aspectJ的 AOP拦截，捕获 添加了 @LogAction 注解的对象，并记录日志
 */
@Aspect
@Component
public class LogAspect {

	private static Logger logger = LoggerFactory.getLogger(LogAspect.class);

	@Autowired
	private SystemLogManageService systemLogManageService;
	
//	@AfterReturning("@annotation(logAction)")
//	public void addLog(LogAction logAction){
//		SystemActionLogType type = logAction.type();
//		String module = logAction.module();
//		String description = logAction.description();
//		if(StringUtils.isBlank(description)){
//			description = type.getDescription() + "[" + module + "]";
//		}
//		HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();
//		systemLogManageService.log(type.ordinal(), description, module,Authority.getUserDetailInfo(request));
//	}

	@After("@annotation(com.aotain.datamanagerweb.annotation.LogAction)")
	public void addOperationLog(JoinPoint joinPoint) throws Exception {
		try{
			ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
			HttpServletRequest request = attributes.getRequest();
			LogAction logAnnotation = getServiceMthodDescription(joinPoint);
			int logType = logAnnotation.logType();

			String module = logAnnotation.module();
			SystemActionLogType type = logAnnotation.type();
			String description = logAnnotation.description();
			String dataJson = logAnnotation.dataJson();

			// 保留原来操作日志的备注信息
			String remark = "";
			if (!StringUtils.isEmpty(type.getDescription())){
				remark = type.getDescription() + "\"" + module + "\"";
			}

			if ( logType == 1 ){
				systemLogManageService.log(type.ordinal(), remark, module,Authority.getUserDetailInfo(request));
			} else if (logType == 2){
				systemLogManageService.dataLog(type,module,description,dataJson);
			} else {
				systemLogManageService.log(type.ordinal(), remark, module,Authority.getUserDetailInfo(request));
				systemLogManageService.dataLog(type,module,description,dataJson);
			}

		} catch (Exception e){
			logger.error("add log failed...",e);
		}

	}

	/**
	 * 获取注解中的属性
	 * @param joinPoint
	 * @return
	 * @throws Exception
	 */
	private static LogAction getServiceMthodDescription(JoinPoint joinPoint)
			throws Exception {
		String targetName = joinPoint.getTarget().getClass().getName();
		String methodName = joinPoint.getSignature().getName();
		Object[] arguments = joinPoint.getArgs();
		Class targetClass = Class.forName(targetName);
		Method[] methods = targetClass.getMethods();
		for (Method method : methods) {
			if (method.getName().equals(methodName)) {
				Class[] clazzs = method.getParameterTypes();
				if (clazzs.length == arguments.length) {
					LogAction operationLog = method.getAnnotation(LogAction.class);
					return operationLog;
				}
			}
		}
		return null;

	}
}
