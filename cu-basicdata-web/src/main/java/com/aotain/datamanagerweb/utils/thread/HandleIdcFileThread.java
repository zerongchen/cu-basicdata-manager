package com.aotain.datamanagerweb.utils.thread;

import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.IdcInformation;
import com.aotain.cu.serviceapi.model.ImportTaskModel;
import com.aotain.datamanagerweb.constant.ImportConstant;
import com.aotain.datamanagerweb.mapper.task.ImportTaskMapper;
import com.aotain.datamanagerweb.serviceapi.PreIdcInfoApi;
import com.aotain.datamanagerweb.utils.ExcelUtil;
import com.aotain.datamanagerweb.utils.SpringUtil;
import com.aotain.datamanagerweb.utils.dataimport.ImportErrorData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;


public class HandleIdcFileThread extends Thread {

	private Logger logger = LoggerFactory.getLogger(HandleIdcFileThread.class);

	private String fileName;
	private String childDir;
	private Long taskId;
	private ImportTaskModel importTaskModel;

	private List<ImportErrorData> idcErrorDatas = new ArrayList<ImportErrorData>();

	public HandleIdcFileThread(String fileName, String childDir, Long taskId, ImportTaskModel model) {
		super();
		this.fileName=fileName;
		this.childDir=childDir;
		this.taskId=taskId;
		this.importTaskModel =model;
	}

	public void run() {
		File dataFile = getFile();
		ImportTaskMapper mapper = getImportTaskMapper();
		ThreadContext context =getThreadContext();
		try {
			//  sheet		 rowNum		content  : 表 行  内容
			Map<Integer, Map<Integer, String[]>> map = ExcelUtil.readExcelFromStream(new FileInputStream(dataFile));
			if (map!=null && !map.isEmpty()) {
				Map<Integer, String[]> idcInfoMap = map.get(0);
				Map<Integer, IdcInformation> idcmap = constructInfo(idcInfoMap);

				long totalNum = Long.valueOf(idcmap.size());
				AtomicLong handleNum = new AtomicLong(0);
				PreIdcInfoApi preIdcInfoApi = getPreIdcInfoApi();
				if (idcmap.size() > 0) {
					idcmap.forEach(( key, value ) -> {
						try {
							value.setCreateUserId(importTaskModel.getCreateUserId().intValue());
							value.setUpdateUserId(importTaskModel.getCreateUserId().intValue());
							ResultDto resultDto = preIdcInfoApi.insert(value);
							if (resultDto.getResultCode() == ResultDto.ResultCodeEnum.ERROR.getCode().intValue()) {
								idcErrorDatas.add(new ImportErrorData(0, key, idcInfoMap.get(key), resultDto.getResultMsg()));
							}
						} catch (Exception e) {
							idcErrorDatas.add(new ImportErrorData(0, key, idcInfoMap.get(key), "网络异常，重试"));
						}
						handleNum.addAndGet(1);
					});
				}

				setPrecent(handleNum.longValue(), totalNum,context);

				//导入已经完成,接下来更新数据库和生成错误文件
				setPrecent(9999, 10000,context);
				if (idcErrorDatas.isEmpty()){
					context.set("status","done");
				}else {
					Map<String,List<ImportErrorData>> dataMap = new HashMap<>();
					dataMap.put("经营者信息",idcErrorDatas);
					String errorFile = fileName.substring(0,fileName.lastIndexOf("."))+"_error";
					ExcelUtil.createExcelWithTemplate(dataMap,"jyz","idcInfoTemplate",errorFile,"xlsx");

					ImportTaskModel model =new ImportTaskModel();
					model.setErrorFileName(errorFile);
					model.setStatus(ImportConstant.StatusEum.IMPORT_SUCCESS.getType());
					model.setTaskId(taskId);
					mapper.update(model);
				}
				setPrecent(1, 1,context);
			}else {
				context.set("status","undone");
				ImportTaskModel model =new ImportTaskModel();
				model.setStatus(ImportConstant.StatusEum.IMPORT_FAIL.getType());
				model.setTaskId(taskId);
				mapper.update(model);
			}
		} catch (Exception e) {
			logger.error("read data from excel error",e);
			context.set("status","undone");
			ImportTaskModel model =new ImportTaskModel();
			model.setStatus(ImportConstant.StatusEum.IMPORT_FAIL.getType());
			model.setTaskId(taskId);
			mapper.update(model);
		}
	}

	/**
	 * 设置百分比
	 * @param dos
	 * @param totals
	 */
	private void setPrecent(long dos,long totals,ThreadContext context){
		NumberFormat nt = NumberFormat.getPercentInstance();
		//设置百分数精确度2即保留两位小数
		nt.setMinimumFractionDigits(2);
		float baifen = (float)dos/totals;
		context.set("importPercent",nt.format(baifen));
	}

	private PreIdcInfoApi getPreIdcInfoApi(){
		return SpringUtil.getBean(PreIdcInfoApi.class);
	}

	private ImportTaskMapper getImportTaskMapper(){
		return SpringUtil.getBean(ImportTaskMapper.class);
	}

	private ThreadContext getThreadContext(){
		return SpringUtil.getBean(ThreadContext.class);
	}

	private File getFile() {
		File folder = new File( System.getProperty("user.dir")+"/save/"+ childDir+"/");
		File[] templates = folder.listFiles(new FilenameFilter() {
			@Override
			public boolean accept( File dir, String name ) {
				if (name.trim().equals(fileName)) {
					return true;
				}
				return false;
			}
		});
		if (templates.length > 0) {
			File file = templates[0];
			return  file;
		}
		return null;
	}

	private Map<Integer, IdcInformation> constructInfo( Map<Integer, String[]> map){

		if(map==null || map.isEmpty()) return null;
		Map<Integer, IdcInformation> userMap= new HashMap<>();
		map.forEach( (key,value)->{
			if (value[0]!=null && value[1]!=null) {
				IdcInformation information=new IdcInformation();
				information.setIdcId(value[0]);
				try {
					if (value[1] != null) information.setIdcName(value[1]);
					if (value[2] != null) information.setCorporater(value[2]);
					if (value[3] != null) information.setIdcZipCode(value[3]);
					if (value[4] != null) information.setIdcAddress(value[4]);
					if (value[5] != null) information.setOfficerName(value[5]);
					if (value[6] != null) information.setOfficerIdType(Integer.parseInt(value[6].substring(0, value[6].indexOf("-"))));
					if (value[7] != null) information.setOfficerId(value[7]);
					if (value[8] != null) information.setOfficerTelephone(value[8]);
					if (value[9] != null) information.setOfficerMobile(value[9]);
					if (value[10] != null) information.setOfficerEmail(value[10]);
					if (value[11] != null) information.setEcName(value[11]);
					if (value[12] != null) information.setEcIdType(Integer.parseInt(value[12].substring(0, value[12].indexOf("-"))));
					if (value[13] != null) information.setEcId(value[13]);
					if (value[14] != null) information.setEcTelephone(value[14]);
					if (value[15] != null) information.setEcMobile(value[15]);
					if (value[16] != null) information.setEcEmail(value[16]);
					userMap.put(key,information);
				}catch (Exception e){
					logger.error("",e);
					idcErrorDatas.add(new ImportErrorData(0,key,value,"模板参数有误,请严格按照模板填写"));
				}
			}else {
				idcErrorDatas.add(new ImportErrorData(0,key,value,"许可证号或经营者名称为空,该条数据不会进行验证"));
			}
		});
		return userMap;
	}



}
