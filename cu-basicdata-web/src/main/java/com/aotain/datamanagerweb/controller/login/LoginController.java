package com.aotain.datamanagerweb.controller.login;

import java.security.Key;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.aotain.cu.serviceapi.dto.SystemLoginLogDTO;
import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.datamanagerweb.service.system.SystemLogManageService;
import com.aotain.datamanagerweb.utils.EncryptionTools;
import com.aotain.datamanagerweb.utils.SpringUtil;
import com.aotain.datamanagerweb.utils.WebContext;
import com.aotain.login.pojo.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSONObject;
import com.aotain.datamanagerweb.constant.DataPermissionConstant;
import com.aotain.datamanagerweb.model.SystemOperator;
import com.aotain.datamanagerweb.utils.HostUtil;
import com.aotain.login.support.Authority;

@Controller
public class LoginController {

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

	@Autowired
	private SystemLogManageService systemLogManageService;
	@Value("${server.port}")
	private String deployPort;
	/**
	 * 登录成功跳转路径
	 */
	private String callBackPath;

	@RequestMapping({"/login"})
	public ModelAndView toLogin(HttpServletRequest request) {
		ModelAndView mav = new ModelAndView("/login");
		mav.addObject("pubexponent", EncryptionTools.gernatePublicKeyExponent());// 保存公钥指数
		mav.addObject("pubmodules", EncryptionTools.gernatePublicKeyModulus());// 保存公钥系数
		request.getSession().setAttribute("prik", EncryptionTools.gernatePrivateKey()); // 将私钥存入session
		return mav;
	}
	@RequestMapping(value="/dealLogin", method=RequestMethod.GET)
	public String dealLoginGet() {
		return "redirect:/login";
	}

	@RequestMapping(value="/dealLogin", method=RequestMethod.POST)
	public String dealLogin(HttpServletRequest request, HttpServletResponse response, LoginUser loginUser,Model model){
		//用户名及密码验证
		loginUser.setUsername(EncryptionTools.decryptedString((Key)request.getSession().getAttribute("prik"), loginUser.getUsername()==null ? "": loginUser.getUsername()));
		loginUser.setPassword(EncryptionTools.decryptedString((Key) request.getSession().getAttribute("prik"), loginUser.getPassword()==null ? "": loginUser.getPassword()));
		System.out.println("do login sessionId : "+request.getSession().getId());
		String resultpage=null;
		try {
			String md5Hex = DigestUtils
					.md5Hex(loginUser.getPassword()).toUpperCase();
			loginUser.setPassword(md5Hex);
			//加上验证码,验证码的规则如下
			/**
			 * 每次登录都需要校验验证码
			 * 连续三次输错用户名或者密码，就去校验验证码
			 * 如果登陆连续失败10次，就记录当前时间，一分钟内不让再登陆
			 * 登陆成功，所有的失败信息都清空
			 */
//            loginUser.setVerificationCode("xxxx");
			//调用登陆接口
			JSONObject result = Authority.login(request,response, loginUser);
			//如果返回的结果中包含有message的信息，就表明登陆失败，失败信息就是mesage中的内容
			if (StringUtils.isNotBlank(result.getString("message"))) {
				if ("验证码错误".equals(result.getString("message"))){
					model.addAttribute("errorCode",1);
				} else {
					model.addAttribute("errorCode",2);
				}
				model.addAttribute("message",result.getString("message"));
				model.addAttribute("pubexponent", EncryptionTools.gernatePublicKeyExponent());// 保存公钥指数
				model.addAttribute("pubmodules", EncryptionTools.gernatePublicKeyModulus());// 保存公钥系数
//				request.getSession().setAttribute("prik", EncryptionTools.gernatePrivateKey()); // 将私钥存入session
				return "/login";
			}
			//登陆成功之后需要调用这个方法，跳转到这个页面，第三个参数是本项目的登陆成功页面的uri
			//"http://"+ HostUtil.getLocalHost()+":"+deployPort+"/home";
			// 不能使用绝对路径

			callBackPath = "http://"+request.getHeader("host")+request.getContextPath()+"/home";
			encapsulatePermissionToSession(request);
			resultpage=Authority.successPage(request,response,callBackPath);

			//日志
			String ipAddress = WebContext.getRequestIpAndPort();
			UserDetailInfo userbak = Authority.getUserDetailInfo(request);
			SystemLoginLogDTO ass=new SystemLoginLogDTO();
			ass.setType(1);
			ass.setUser(loginUser.getUsername());
			ass.setUserName(loginUser.getUsername());
			ass.setLoginIp(ipAddress);
			ass.setHostName(request.getServerName());
			ass.setUserId(Long.valueOf(userbak.getUserId() + ""));
			ass.setUserLevel(userbak.getUserLevel() == null ? 3 : userbak.getUserLevel());
			systemLogManageService.insertLoginLog(ass);
		} catch (Exception e) {
			logger.error("login error!", e);
			return "redirect:/login";
		}
		return resultpage;

	}

	private void encapsulatePermissionToSession(HttpServletRequest request) {
		UserDetailInfo user = Authority.getUserDetailInfo(request);
		Map<String, String> permissionMap = encapsulatePermissionMap(user);
		HttpSession session = request.getSession(false);
		//用户拥有权限的单位码
		session.setAttribute(DataPermissionConstant.AUTH_CITY_CODE_LIST, permissionMap.get(DataPermissionConstant.AUTH_CITY_CODE_LIST));
		//用户拥有权限的专线标识
		session.setAttribute(DataPermissionConstant.AUTH_IDENTITY_LIST, permissionMap.get(DataPermissionConstant.AUTH_IDENTITY_LIST));
		//用户拥有权限的机房
		session.setAttribute(DataPermissionConstant.AUTH_HOUSE_LIST, permissionMap.get(DataPermissionConstant.AUTH_HOUSE_LIST));
		//用户按钮权限
		List<Appactions> alist=user.getActionsList();
		if(alist!=null && alist.size()>0){
			for (Appactions bo:alist){
				session.setAttribute(bo.getActionname(),"1");
			}
		}
	}
	
	private Map<String, String> encapsulatePermissionMap(UserDetailInfo user) {
		Map<String, String> permissionMap = new HashMap<String, String>();
		if (user != null) {
			List<DataPermission> dataPermissions = user.getDataPermissions();
			if (dataPermissions != null && dataPermissions.size() > 0) {
				for (DataPermission dataPermission : dataPermissions) {
					String key = dataPermission.getDataPermissionToken();
					List<DataPermissionSetting> dataPermissionSettings = dataPermission.getSettings();
					StringBuffer buffer = new StringBuffer();
					if (dataPermissionSettings != null && !dataPermissionSettings.isEmpty()) {
						for (DataPermissionSetting dataPermissionSetting : dataPermissionSettings) {
							String value = dataPermissionSetting.getSettingKey();
							buffer.append(value).append(",");
						}
					}
					if (buffer.lastIndexOf(",") >= 0) {
						buffer.replace(buffer.lastIndexOf(","), buffer.length(), "");
					}
					permissionMap.put(key, buffer.toString());
				}
			}
		}
		return permissionMap;
	}
	
	/**
	 * 获取验证码图片
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value="/code", consumes= MediaType.ALL_VALUE, produces = MediaType.IMAGE_JPEG_VALUE)
	ResponseEntity<byte[]> getValidateCode(HttpServletRequest request, HttpServletResponse response) {
		System.out.println("code sessionId : "+request.getSession().getId());
		byte[] image= Authority.getValidateCode(request);
		response.setContentType(MediaType.IMAGE_JPEG_VALUE);
		return ResponseEntity.ok(image);
	}


	@RequestMapping(value ="/logout")
	public String logout(HttpServletRequest request) {
		UserDetailInfo userInfo = Authority.getUserDetailInfo(request);
		Authority.logout(request);
		//日志
		String ipAddress = WebContext.getRequestIpAndPort();
		SystemLoginLogDTO ass=new SystemLoginLogDTO();
		ass.setType(2);
		ass.setUser(userInfo.getUserName());
		ass.setUserName(userInfo.getUserName());
		ass.setLoginIp(ipAddress);
		ass.setHostName(request.getServerName());
		ass.setUserId(Long.valueOf(userInfo.getUserId() + ""));
		ass.setUserLevel(userInfo.getUserLevel() == null ? 3 : userInfo.getUserLevel());
		systemLogManageService.insertLoginLog(ass);
		return "redirect:/login";
	}


	@RequestMapping({"","/","/home"})
    public ModelAndView home(){
		ModelAndView mav = new ModelAndView("/home");
        return mav;
    }

	@RequestMapping(value ="/index")
    public ModelAndView index() {
		ModelAndView mav = new ModelAndView("/index");
        return mav;
    }

	@RequestMapping(value ="/nopermission")
	public ModelAndView nopermission() {
		ModelAndView mav = new ModelAndView("/nopermission");
		return mav;
	}

	@RequestMapping(value = "/getLoginUser")
    @ResponseBody
    public SystemOperator getLoginUser(HttpServletRequest request) {
		SystemOperator operator = new SystemOperator();
		UserDetailInfo userInfo = Authority.getUserDetailInfo(request);
		Map<String, String> permissionMap = encapsulatePermissionMap(userInfo);
		operator.setUserId(userInfo.getUserId());
		operator.setUserName(userInfo.getUserName());
		operator.setUserLevel(userInfo.getUserLevel());
		operator.setAreaCodes(permissionMap.get(DataPermissionConstant.AUTH_CITY_CODE_LIST));
		operator.setAuthHouses(permissionMap.get(DataPermissionConstant.AUTH_HOUSE_LIST));
		operator.setAuthIdentities(permissionMap.get(DataPermissionConstant.AUTH_IDENTITY_LIST));
        return operator;
    }
}
