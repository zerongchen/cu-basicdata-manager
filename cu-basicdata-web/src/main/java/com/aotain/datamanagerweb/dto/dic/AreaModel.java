package com.aotain.datamanagerweb.dto.dic;

import lombok.Data;

import java.io.Serializable;

@Data
public class AreaModel extends BaseModel implements Serializable {
    private static final long serialVersionUID = -1384988812720447848L;
    private String code;
    private String parentCode;
    private String mc;
    private String postCode;
    private String areaCode;
    private Integer codeLevel;
    private Long id;
    private Boolean isCascade;//是否级联查询地市即地市已下
    private int flag;//部署的省份标识
    private int build;//部署省份
}
