package com.aotain.datamanagerweb.controller.common;

import com.aotain.cu.serviceapi.model.BaseModel;
import com.aotain.datamanagerweb.cache.CommonCache;
import com.aotain.datamanagerweb.dto.dic.AreaModelDTO;
import com.aotain.datamanagerweb.dto.dic.BaseCodeDataDto;
import com.aotain.datamanagerweb.dto.dic.JyGzModel;
import com.aotain.datamanagerweb.model.AreaCodeQueryDto;
import com.aotain.datamanagerweb.model.SelectInfoBean;
import com.aotain.datamanagerweb.service.CommonService;
import com.aotain.datamanagerweb.utils.SpringUtil;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class CommonController {

    private Logger logger = LoggerFactory.getLogger(CommonController.class);

    @Autowired
    private CommonService commonService;

    @Autowired
    private CommonCache commonCache;
    
    @RequestMapping(value = "/getHouseSelectInfo")
    @ResponseBody
    public List<SelectInfoBean> getHouseSelectInfo(SelectInfoBean domain){
        List<SelectInfoBean> list=commonService.getHouseSelectInfo(domain);
        List<String> userOwnHouseList = SpringUtil.getSystemOperator().getAuthHouseList();
        List<SelectInfoBean> houseList = new ArrayList<SelectInfoBean>();
        for(SelectInfoBean bean:list){
        	for(String houseId:userOwnHouseList){
        		if(bean.getValue().equals(houseId)){
        			houseList.add(bean);
        		}
        	}
        }
        return houseList;
    }

    @RequestMapping(value = "/getIDCHouseSelectInfo")
    @ResponseBody
    public List<SelectInfoBean> getIDCHouseSelectInfo(SelectInfoBean domain){
        List<SelectInfoBean> list=commonService.getIDCHouseSelectInfo(domain);
        List<String> userOwnHouseList = SpringUtil.getSystemOperator().getAuthHouseList();
        List<SelectInfoBean> houseList = new ArrayList<SelectInfoBean>();
        for(SelectInfoBean bean:list){
            for(String houseId:userOwnHouseList){
                if(bean.getValue().equals(houseId)){
                    houseList.add(bean);
                }
            }
        }
        return houseList;
    }

    @RequestMapping(value = "/getUserSelectInfo")
    @ResponseBody
    public List<SelectInfoBean> getUserSelectInfo(SelectInfoBean domain){
        domain.setAreaCodes(StringUtils.join(SpringUtil.getSystemOperator().getAreaList(),","));
        domain.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        domain.setAuthIdentities(StringUtils.join(SpringUtil.getSystemOperator().getAuthIdentityList(),","));
        List<SelectInfoBean> list=commonService.getUserSelectInfo(domain);
        if(list==null){
            return new ArrayList<SelectInfoBean>();
        }else{
            return list;
        }
    }

    @RequestMapping(value = "/common/getAreaCode")
    @ResponseBody
    public AreaModelDTO getAreaData(){
        try {
            return commonCache.getAreaCodeCache().get("areaCode");
        }catch (Exception e){
            logger.error("get area code error",e);
            return null;
        }
    }

    @RequestMapping(value = "/common/refreshAreaCode")
    @ResponseBody
    public String  refreshAreaCode(){
        try {
            commonCache.refreshCache("getAreaCodeCache");
            return "success";
        }catch (Exception e){
            logger.error("get area code error",e);
            return "error";
        }
    }

    @RequestMapping(value = "/common/getRule")
    @ResponseBody
    public List<JyGzModel> getRule(){
        try {
            return commonCache.getJyGzCache().get("jygz");
        }catch (Exception e){
            logger.error("get JYGZ code error",e);
            return null;
        }
    }

    @RequestMapping(value = "/common/refreshJyGz")
    @ResponseBody
    public String  refreshJyGz(){
        try {
            commonCache.refreshCache("getJyGzCache");
            return "success";
        }catch (Exception e){
            logger.error("get JYGZ code error",e);
            return "error";
        }
    }

    @RequestMapping(value = "/common/getBaseCode")
    @ResponseBody
    public BaseCodeDataDto getBaseCode(){
        try {
            return commonCache.getBaseCodeDataCache().get("baseCodeDate");
        }catch (Exception e){
            logger.error("get area code error",e);
            return null;
        }
    }

    @RequestMapping(value = "/common/refreshBaseCode")
    @ResponseBody
    public String  refreshBaseCode(){
        try {
            commonCache.refreshCache("getBaseCodeDataCache");
            return "success";
        }catch (Exception e){
            logger.error("get BASECODE code error",e);
            return "error";
        }
    }

    @RequestMapping(value = "/common/getSubOrdArea")
    @ResponseBody
    public List<SelectInfoBean> getSubOrdArea(){
        List<SelectInfoBean> list=commonService.getSubOrdArea();
        return list;
    }

    @RequestMapping(value = "/common/getSubOrdAreaCode")
    @ResponseBody
    public List<SelectInfoBean> getSubOrdAreaAreaCode(@RequestBody  AreaCodeQueryDto queryDto){
        List<SelectInfoBean> list= commonService.getSubOrdAreaAreaCode(queryDto);
        if(list==null){
            return new ArrayList<SelectInfoBean>();
        }else{
            return list;
        }
    }

    @RequestMapping(value = "/common/getUnitNameList")
    @ResponseBody
    public List<SelectInfoBean> getUnitNameList(){
        List<SelectInfoBean> list=commonService.getUnitNameList();
        return list;
    }
    
    @RequestMapping(value = "/common/getAreaByHouseId")
    @ResponseBody
    public List<SelectInfoBean> getAreaCodeByHouseId(String houseId){
        String areaCoesStr=commonService.getAreaCodeByHouseId(Long.parseLong(houseId));
        return sortAreacodeList(areaCoesStr);
    }
    
    @RequestMapping(value = "/common/getAreaByUserId")
    @ResponseBody
    public List<SelectInfoBean> getAreaByUserId(String userId){
        String areaCoesStr=commonService.getAreaByUserId(Long.parseLong(userId));
        List<String> auhAreaList = SpringUtil.getSystemOperator().getAreaList();
        String[] dbAreaArr = areaCoesStr.split(",");
        StringBuffer userAreaCode = new StringBuffer();
        for(String area:dbAreaArr){
        	for(String authArea:auhAreaList){
        		if(area.equals(authArea)){
        			userAreaCode.append(area+",");
        			break;
        		}
        	}
        }
        return sortAreacodeList(userAreaCode.toString());
    }

	private List<SelectInfoBean> sortAreacodeList(String areaCoesStr) {
		List<SelectInfoBean> list=commonService.getSubOrdArea();
        if(areaCoesStr==null||areaCoesStr==""){
        	return null;
        }
        String[] areaCodeArr = areaCoesStr.split(",");
        List<SelectInfoBean> resultList = new ArrayList<SelectInfoBean>();
        for(String area:areaCodeArr){
        	for(SelectInfoBean bean:list){
        		if(bean.getValue().equals(area)){
        			resultList.add(bean);
        		}
        	}
        }
		return resultList;
	}

    /**
     * 查询所有用户名
     * @param
     * @return
     */
    @RequestMapping(value = "/common/getUserNames")
    @ResponseBody
    public Map<String,Object> getUserNames(String keyword){
        BaseModel dto = new BaseModel();
        dto.setAreaCodes(StringUtils.join(SpringUtil.getSystemOperator().getAreaList(),","));
        dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
        dto.setAuthIdentities(StringUtils.join(SpringUtil.getSystemOperator().getAuthIdentityList(),","));
        dto.setUserName(keyword);
        Map<String,Object> reslut = new HashMap<String,Object>();
        reslut.put("message","");
        reslut.put("value",commonService.getUserNames(dto));
        reslut.put("code",200);
        reslut.put("redirect","");
        return reslut;
    }

    /**
     * 获取用户隶属地市码信息
     * @return
     */
    @RequestMapping(value = "/getUserSubAreaCode")
    @ResponseBody
    public List<SelectInfoBean> getUserSubAreaCode(){
        List<SelectInfoBean> list=commonService.getUserSubAreaCode(SpringUtil.getSystemOperator().getAreaList());
        if(list==null){
            return new ArrayList<SelectInfoBean>();
        }else{
            return list;
        }
    }

    /**
     * 判断是否存在经营者
     * @return
     */
    @ResponseBody
    @RequestMapping("/common/existIdc")
    public String existIdc(){
        return commonService.existIdc();
    }

}
