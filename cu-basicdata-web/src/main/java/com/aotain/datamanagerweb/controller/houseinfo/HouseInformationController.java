package com.aotain.datamanagerweb.controller.houseinfo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.aotain.common.config.redis.BaseRedisService;
import com.aotain.common.utils.model.report.SmmsResultCache;
import com.aotain.cu.serviceapi.dto.*;
import com.aotain.datamanagerweb.service.system.SystemLogManageService;
import com.aotain.datamanagerweb.utils.ProxyUtil;
import com.aotain.datamanagerweb.utils.constant.RedisKeyConstant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.aotain.cu.serviceapi.model.HouseFrameInformation;
import com.aotain.cu.serviceapi.model.HouseGatewayInformation;
import com.aotain.cu.serviceapi.model.HouseIPSegmentInformation;
import com.aotain.cu.serviceapi.model.HouseInformation;
import com.aotain.cu.serviceapi.model.IdcInformation;
import com.aotain.cu.serviceapi.model.PageResult;
import com.aotain.datamanagerweb.annotation.LogAction;
import com.aotain.datamanagerweb.annotation.RequiresPermission;
import com.aotain.datamanagerweb.constant.DataPermissionConstant;
import com.aotain.common.config.ContextUtil;
import com.aotain.common.config.model.SystemActionLogType;
import com.aotain.datamanagerweb.service.CommonService;
import com.aotain.datamanagerweb.service.houseinfo.HouseInfomationService;
import com.aotain.datamanagerweb.serviceapi.PreIdcInfoApi;
import com.aotain.datamanagerweb.utils.SpringUtil;
import com.aotain.datamanagerweb.utils.constant.HouseConstant;
import com.aotain.login.pojo.DataPermission;
import com.aotain.login.pojo.UserDetailInfo;
import com.aotain.login.support.Authority;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

/**
 * @ClassName HouseInformationController
 * @Author tanzj
 * @Date 2018/7/24
 **/
@Component
@Controller
@RequestMapping(value = "/houseinfo")
public class HouseInformationController {

    private static final Logger logger = LoggerFactory.getLogger(HouseInformationController.class);
	
	private static final String MODULE_NAME = "机房主体";
	private static final String REPORT_FILE_KEY="smms_999_file_result";

    @Autowired
    private PreIdcInfoApi preIdcInfoApi;

    @Autowired
    private HouseInfomationService houseInfomationService;

    @Autowired
    private CommonService commonService;

    @Autowired
    private SystemLogManageService systemLogManageService;

    @Autowired
    private BaseRedisService baseRedisService;
    

    @RequestMapping(value = "/index",method = RequestMethod.GET)
    public String getIndex(){
        return "/houseinfo/house_index";
    }

    @RequiresPermission(value="ROLE_PRE_HOUSE_QUERY")
    @RequestMapping(value = "/houselist",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.READ)
    public PageResult<HouseInformationDTO> getHouseIndexData(HouseInformationDTO dto){
    	dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
		dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
		dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        dto.setOperateType(HouseConstant.OperationTypeEnum.ADD.getValue());
        return houseInfomationService.getHouseIndexData(dto);
    }

    @RequestMapping(value = "/validate",method = RequestMethod.POST)
    @ResponseBody
    public AjaxValidationResult validate(@RequestBody HouseInformationDTO dto){
    	dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
		dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
		dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        PageResult<IdcInformation> jyz = preIdcInfoApi.listIdcInfo();
        dto.setJyzId(jyz.getRows().get(0).getJyzId());
        if(dto.getHouseId()!=null){
            dto.setAddType(1);
        }else{
            dto.setAddType(2);
        }
        dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
		dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
		dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        dto.setOperateType(HouseConstant.OperationTypeEnum.ADD.getValue());
        return houseInfomationService.preValidate(dto);
    }

    @RequestMapping(value = "/ipvalidate",method = RequestMethod.POST)
    @ResponseBody
    public ResultDto ipvalidate(@RequestBody  HouseIPSegmentInforDTO[] dto){
        for(HouseIPSegmentInforDTO obj : dto){
            obj.setAddType(2);
            obj.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
			obj.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
			obj.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
            obj.setOperateType(HouseConstant.OperationTypeEnum.ADD.getValue());
        }
         return houseInfomationService.preIpValidate(Arrays.asList(dto));
    }

    @RequestMapping(value = "/framvalidate",method = RequestMethod.POST)
    @ResponseBody
    public ResultDto framvalidate(@RequestBody  HouseFrameInformationDTO[] dto){
        for(HouseFrameInformationDTO obj : dto){
            obj.setAddType(2);
            obj.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
			obj.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
			obj.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
            obj.setOperateType(HouseConstant.OperationTypeEnum.ADD.getValue());
        }
        return houseInfomationService.preFramValidate(Arrays.asList(dto));
    }

    @RequestMapping(value = "/linkvalidate",method = RequestMethod.POST)
    @ResponseBody
    public ResultDto linkvalidate(@RequestBody  HouseGatewayInformationDTO[] dto){
        for(HouseGatewayInformationDTO obj : dto){
            obj.setAddType(2);
            obj.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
			obj.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
			obj.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
            obj.setOperateType(HouseConstant.OperationTypeEnum.ADD.getValue());
        }
        return houseInfomationService.preLinkValidate(Arrays.asList(dto));
    }

    @RequiresPermission(value="ROLE_PRE_HOUSE_ADD")
    @RequestMapping(value = "/save",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.CREATE,logType = 0)
    public ResultDto save(@RequestBody HouseInformation dto, HttpServletRequest request){
        ResultDto result1 = new ResultDto();
        try{
            PageResult<IdcInformation> jyz = preIdcInfoApi.listIdcInfo();
            dto.setJyzId(jyz.getRows().get(0).getJyzId());
            dto.setHouseZipCode(commonService.getXzqydmCodeByCode(dto.getHouseCounty ().toString()).getPostCode());
            dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
            dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
            dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
            dto.setAppId(SpringUtil.getSystemOperator().getAppId());
            dto.setDataPermissionId(SpringUtil.getSystemOperator().getDataPermissionId());
            dto.setDataPermissionToken(SpringUtil.getSystemOperator().getDataPermissionToken());
            dto.setDataPermissionName(SpringUtil.getSystemOperator().getDataPermissionName());
            dto.setDataPermissionDesc(SpringUtil.getSystemOperator().getDataPermissionDesc());
            dto.setPermissionMethodUrl(SpringUtil.getSystemOperator().getPermissionMethodUrl());
            dto.setUserToken(SpringUtil.getSystemOperator().getUserToken());
            dto.setDataPermissionSettingList(SpringUtil.getAuthHomeSetting());
            if(dto.getIpSegList()!=null && dto.getIpSegList().size()>0){
                for(HouseIPSegmentInformation ipTmp: dto.getIpSegList()){
                    ipTmp.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
                    ipTmp.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
                    ipTmp.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
                }
            }
            if(dto.getFrameList()!=null && dto.getFrameList().size()>0){
                for(HouseFrameInformation framTmp: dto.getFrameList()){
                    framTmp.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
                    framTmp.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
                    framTmp.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
                }
            }
            if(dto.getGatewayInfoList()!=null && dto.getGatewayInfoList().size()>0){
                for(HouseGatewayInformation linkTmp: dto.getGatewayInfoList()){
                    linkTmp.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
                    linkTmp.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
                    linkTmp.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
                }
            }
            List<HouseInformation> list = new ArrayList<HouseInformation>();
            list.add(dto);
            List<ResultDto> result = houseInfomationService.save(list);
            if(result.get(0).getResultCode()==0){
                synchroHouseAuthInfo(request);
                result1 = houseInfomationService.preJudHouse(result.get(0).getPid().toString());
            }else{
                result1 =  result.get(0);
            }
            if(result.get(0).getResultCode()==0){
                dto.setHouseId(Long.valueOf(result.get(0).getPid()));
//                systemLogManageService.dataLog(dto, "houseId", SystemActionLogType.CREATE, "机房-机房主体信息", dto.getHouseId());
            }
            try {
                String dataJson = result.get(0).getPid()+"-"+dto.getHouseName();
                String description = JSON.toJSONString(dto);
                ProxyUtil.changeVariable(this.getClass(),"save",dataJson,description);
            } catch (Exception e){
                logger.error("record data log fail",e);
            }

        }catch (Exception e){
            result1.setResultCode(1);
            result1.setResultMsg("新增失败！");
        }
        return result1;
	}

    /**
     * 同步机房权限信息
     *
     * @author : songl
     * @since:2018年9月19日 下午6:38:47
     */
	private void synchroHouseAuthInfo( HttpServletRequest request) {
		String sycnhPath = SpringUtil.getSystemOperator().getDataPermissionUrl()+"/"+SpringUtil.getSystemOperator().getUserToken().replace("=", "%3D")+"?deployId="+SpringUtil.getSystemOperator().getAppId();
		//获取最新的权限机房信息
		JsonObject jsonObject = SpringUtil.getPaassportHttpResult(sycnhPath, "");
		UserDetailInfo userDetailInfo = Authority.getUserDetailInfo(request);
		if(jsonObject!=null&&"1".equals(jsonObject.get("statuCode").toString())){
			JsonArray jsonArray  = jsonObject.getAsJsonArray("result");
			DataPermission dataPermission = null;
			HttpSession session = request.getSession(false);
			for(JsonElement element:jsonArray){
				dataPermission = JSON.parseObject(element.toString(), DataPermission.class);
				if(DataPermissionConstant.AUTH_HOUSE_LIST.equals(dataPermission.getDataPermissionToken())){
					List<String> homeList = new ArrayList();
					for(com.aotain.login.pojo.DataPermissionSetting setting:dataPermission.getSettings()){
						homeList.add(setting.getSettingKey());
					}
					session.setAttribute(DataPermissionConstant.AUTH_HOUSE_LIST, homeList);

					break;
				}
			}

		}
	}

    @RequiresPermission(value="ROLE_PRE_HOUSE_UPDATE")
    @RequestMapping(value = "/update",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.UPDATE,logType = 0)
    public ResultDto update(@RequestBody HouseInformationDTO dto,HttpServletRequest request){
        ResultDto result1 = new ResultDto();
	    try{
            PageResult<IdcInformation> jyz = preIdcInfoApi.listIdcInfo();
            dto.setJyzId(jyz.getRows().get(0).getJyzId());
            dto.setHouseZipCode(commonService.getXzqydmCodeByCode(dto.getHouseCounty().toString()).getPostCode());
            dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
            dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
            dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
            dto.setAppId(SpringUtil.getSystemOperator().getAppId());
            dto.setDataPermissionId(SpringUtil.getSystemOperator().getDataPermissionId());
            dto.setDataPermissionToken(SpringUtil.getSystemOperator().getDataPermissionToken());
            dto.setDataPermissionName(SpringUtil.getSystemOperator().getDataPermissionName());
            dto.setDataPermissionDesc(SpringUtil.getSystemOperator().getDataPermissionDesc());
            dto.setPermissionMethodUrl(SpringUtil.getSystemOperator().getPermissionMethodUrl());
            dto.setUserToken(SpringUtil.getSystemOperator().getUserToken());
            dto.setDataPermissionSettingList(SpringUtil.getAuthHomeSetting());
            List<HouseInformation> list = new ArrayList<HouseInformation>();
            list.add(dto);
            List<ResultDto> result = houseInfomationService.update(list);
            if(result.get(0).getResultCode()==0){
                result1 = houseInfomationService.preJudHouse(dto.getHouseId().toString());
                synchroHouseAuthInfo(request);
            }else {
                result1 = result.get(0);
            }
//            if(result.get(0).getResultCode()==0){
//                systemLogManageService.dataLog(dto, "houseId", SystemActionLogType.UPDATE, "机房-机房主体信息", dto.getHouseId());
//            }
            try {
                String dataJson = dto.getHouseId()+"-"+dto.getHouseName();
                String description = JSON.toJSONString(dto);
                ProxyUtil.changeVariable(this.getClass(),"update",dataJson,description);
            } catch (Exception e){
                logger.error("record data log fail",e);
            }
        }catch(Exception e){
            result1.setResultCode(1);
            result1.setResultMsg("修改失败！");
        }
        return result1;
    }

    @RequiresPermission(value="ROLE_PRE_HOUSE_DETAIL")
    @RequestMapping(value = "/getHouseDetail",method = RequestMethod.GET)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.DETAIINFO)
    public HouseInformationDTO getHouseDetail(Integer houseId){
        return houseInfomationService.getHouseDetail(houseId);
    }

    @RequestMapping(value = "/getIpDetail",method = RequestMethod.POST)
    @ResponseBody
    public PageResult<HouseIPSegmentInforDTO> getHouseIPDetailData(HouseIPSegmentInforDTO dto){
    	dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
    	dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
    	dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        return houseInfomationService.getHouseIPDetailData(dto);
    }

    @RequestMapping(value = "/getFrameDetail",method = RequestMethod.POST)
    @ResponseBody
    public PageResult<HouseFrameInformationDTO> getHouseFrameDetail(HouseFrameInformationDTO dto){
    	dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
    	dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
    	dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        return houseInfomationService.getHouseFrameDetail(dto);
    }

    @RequestMapping(value = "/getLinkDetail",method = RequestMethod.POST)
    @ResponseBody
    public PageResult<HouseGatewayInformationDTO> getHouseLinkDetail(HouseGatewayInformationDTO dto){
    	dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
    	dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
    	dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
        return houseInfomationService.getHouseLinkDetail(dto);
    }

    /**
     * 预审
     * @param houseIds
     * @return
     */
    @RequiresPermission(value="ROLE_PRE_HOUSE_APPROVE")
    @RequestMapping(value = "/preJudHouse",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.APPROVE)
    public ResultDto preJudHouse(@RequestParam("houseIds[]") String[] houseIds){
        ResultDto result = new ResultDto();
        int i= 0;
        for(String str:houseIds){
            result = houseInfomationService.preJudHouse(str);
            if(result.getResultCode()==0){
            	 systemLogManageService.dataLog("houseId", SystemActionLogType.APPROVE, "机房-机房主体信息", str);
                i++;
            }
        }
        result.setResultMsg("预审成功数:"+i+";预审失败数:"+(houseIds.length-i));
        return result;
    }

    /**
     * 撤销预审
     * @param houseIds
     * @return
     */
    @RequiresPermission(value="ROLE_PRE_HOUSE_REVOKE")
    @RequestMapping(value = "/revertApprove",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.REVOKEAPPROVE)
    public ResultDto revertApprove(String houseIds){
        ResultDto result = new ResultDto();
        result = houseInfomationService.revertApprove(houseIds);
        if(result.getResultCode() == 0) {
        	 systemLogManageService.dataLog("houseId", SystemActionLogType.REVOKEAPPROVE, "机房-机房主体信息", houseIds);
        }
        return result;
    }

    /**
     * 删除
     * @param houseIds
     * @return
     */
    @RequiresPermission(value="ROLE_PRE_HOUSE_DEL")
    @RequestMapping(value = "/delete",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.DELETE)
    public ResultDto delete(@RequestParam("houseIds[]") Long[] houseIds,HttpServletRequest request){
        ResultDto result = new ResultDto();
        List<HouseInformationDTO> deleteList = new ArrayList<>();
        for(Long id:houseIds){
            HouseInformationDTO dto = new HouseInformationDTO();
            dto.setHouseId(id);
            dto.setCityCodeList(SpringUtil.getSystemOperator().getAreaList());
            dto.setUserAuthHouseList(SpringUtil.getSystemOperator().getAuthHouseList());
            dto.setUserAuthIdentityList(SpringUtil.getSystemOperator().getAuthIdentityList());
            dto.setAppId(SpringUtil.getSystemOperator().getAppId());
            dto.setDataPermissionId(SpringUtil.getSystemOperator().getDataPermissionId());
            dto.setDataPermissionToken(SpringUtil.getSystemOperator().getDataPermissionToken());
            dto.setDataPermissionName(SpringUtil.getSystemOperator().getDataPermissionName());
            dto.setDataPermissionDesc(SpringUtil.getSystemOperator().getDataPermissionDesc());
            dto.setPermissionMethodUrl(SpringUtil.getSystemOperator().getPermissionMethodUrl());
            dto.setUserToken(SpringUtil.getSystemOperator().getUserToken());
            dto.setDataPermissionSettingList(SpringUtil.getAuthHomeSetting());
            deleteList.add(dto);
        }
        result = houseInfomationService.delete(deleteList);
        synchroHouseAuthInfo(request);
        if(result.getResultCode()==0){
            systemLogManageService.dataLog("houseId", SystemActionLogType.DELETE, "机房-机房主体信息",houseIds );
        }
        return result;
    }

    /**
     * 获取审核结果
     * @param houseIds
     * @return
     */
    @RequestMapping(value = "/getChkResult",method = RequestMethod.POST)
    @ResponseBody
    @LogAction(module=MODULE_NAME,type=SystemActionLogType.DOWNLOAD_CHECK_RESULT)
    public List<ApproveResultDto> getChkResult(String houseIds){
        List<ApproveResultDto> result = new ArrayList<>();
        String resultId = (String) baseRedisService.getHash(RedisKeyConstant.DATA_APPROVE_CACHE,"2_"+houseIds);
        if(resultId==null){
            return null;
        }else {
            result = houseInfomationService.findCheckResult(resultId);
        }
        return houseInfomationService.findCheckResult(resultId);
    }

    @RequestMapping(value = "/getReportFileInfo",method = RequestMethod.POST)
    @ResponseBody
    public PageResult<ReportFile> getReportFileInfo(String submitId){
        return houseInfomationService.getReportFileInfo(submitId);
    }
    
    @RequestMapping(value = "/fileRedeal",method = RequestMethod.POST)
    @ResponseBody
    public Boolean fileRedeal(SmmsResultCache fileResult){
    	BaseRedisService<String, String, String> rediscluster = ContextUtil.getContext().getBean("baseRedisServiceImpl",BaseRedisService.class);
    	try {
			String fileInfo =  rediscluster.getHash(REPORT_FILE_KEY, fileResult.getFileName());
	    	if(fileInfo!=null){//存在redis记录则不用写入
	    		logger.info("ReportFile info have exist in rediscluster");
	    		return true;
	    	}
			rediscluster.putHash(REPORT_FILE_KEY, fileResult.getFileName(), JSON.toJSONString(fileResult));
			logger.info("[ReportFile write into redis info]:"+JSON.toJSONString(fileResult));
    	} catch (Exception e) {
    		logger.info("[ReportFile write into redis failed] fileName:"+fileResult.getFileName());
			return false;
		}
    	return true;
    }
    
    
}
