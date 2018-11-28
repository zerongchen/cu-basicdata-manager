package com.aotain.datamanagerweb.service.isp;

import com.aotain.cu.serviceapi.dto.ResultDto;
import com.aotain.cu.serviceapi.model.IspModel;
import com.aotain.datamanagerweb.mapper.isp.IspMapper;
import com.aotain.datamanagerweb.model.SelectInfoBean;
import com.aotain.datamanagerweb.service.BaseService;
import com.aotain.datamanagerweb.service.CommonService;
import com.aotain.datamanagerweb.utils.ExcelUtil;
import com.aotain.datamanagerweb.utils.dataimport.ImportErrorData;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.*;

@Scope("prototype")
@Component
public class IspValidator extends BaseService {

    private List<ImportErrorData> errorList = new ArrayList<ImportErrorData>();

    private String fileName;

    @Autowired
    private CommonService commonService;

    @Autowired
    private IspMapper ispMapper;

    public ResultDto validateAndWrite( Map<Integer, Map<Integer, String[]>> map){
        Map<Integer, String[]> sheetMap = map.get(0);
        if (sheetMap.isEmpty()) return getErrorResult("sheet 1 为空");
        Map<String,Byte> userMap= new HashMap<>();
        List<SelectInfoBean> selectInfoBeans = commonService.getUnitNameList();
        selectInfoBeans.forEach(selectInfoBean -> {
            userMap.put(selectInfoBean.getTitle(),(byte)1);
        });

        List<IspModel> isps = ispMapper.query(new IspModel());
        Map<String,Byte> ispMap= new HashMap<>();
        isps.forEach(o->{
            ispMap.put(o.getUnitName(),(byte)1);
        });

        Set<IspModel> ispModels = new HashSet<>();
        sheetMap.forEach((rowNum,rowValue)->{
            if (rowValue.length>=2){
                String unitName = rowValue[0];
                String filterMode = rowValue[1];
                boolean validate = true;
                if (StringUtils.isEmpty(unitName)){
                    errorList.add(new ImportErrorData(1,rowNum,rowValue,"单位名称为空"));
                    validate=false;
                }else if (userMap.get(unitName)==null){
                    errorList.add(new ImportErrorData(1,rowNum,rowValue,"单位名称不存在"));
                    validate=false;
                }else if (ispMap.get(unitName)!=null){
                    errorList.add(new ImportErrorData(1,rowNum,rowValue,"该单位已经存在ISP清单中"));
                    validate=false;
                }
                if(StringUtils.isEmpty(filterMode)){
                    errorList.add(new ImportErrorData(1,rowNum,rowValue,"没有标明是否过滤"));
                    validate=false;
                }else if (!("1".equals(filterMode) || "2".equals(filterMode))){
                    errorList.add(new ImportErrorData(1,rowNum,rowValue,"是否过滤值有误"));
                    validate=false;
                }
                if (validate){
                    IspModel model = new IspModel();
                    model.setUnitName(unitName);
                    model.setFilterMode(Byte.parseByte(filterMode));
                    ispModels.add(model);
                }
            }else {
                errorList.add(new ImportErrorData(1,rowNum,rowValue,"信息不全"));
            }
        });
        insertDB(ispModels);
        String errorFile = createErrorFile(errorList);
        if (StringUtils.isEmpty(errorFile)){
            return getSuccessResult();
        }
        return getSuccessResult(errorFile);
    }


    public void insertDB(Set<IspModel> models){
        if (models.isEmpty()) return;
        List<IspModel> list = new ArrayList<>();
        list.addAll(models);
        ispMapper.banthImport(list);
    }

    public String createErrorFile(List<ImportErrorData> models){
        if(models.isEmpty()) return null;
        Map<String,List<ImportErrorData>> dataMap = new HashMap<>();
        dataMap.put("ISP",models);
        String errorFile = fileName.substring(0,fileName.lastIndexOf("."))+"_error";
        ExcelUtil.createExcelWithTemplate(dataMap,"isp","ispTemplate",errorFile,"xlsx");
        return errorFile;
    }

    public void setFileName(String fileName){
        this.fileName=fileName;
    }

}
