package com.aotain.datamanagerweb.model;

import java.io.Serializable;

import com.aotain.datamanagerweb.dto.dic.BaseModel;

import lombok.Getter;
import lombok.Setter;

/**
 * 隶属单位
 * @author silence
 * @time 2018年8月13日
 */
@Getter
@Setter
public class ChinaArea extends BaseModel implements Serializable{

	private long areaId;
	private String areaCode;
	private String areaName;
	private String preCode;
}
