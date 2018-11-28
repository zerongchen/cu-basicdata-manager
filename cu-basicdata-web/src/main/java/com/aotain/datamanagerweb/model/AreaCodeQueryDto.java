package com.aotain.datamanagerweb.model;

import lombok.Getter;
import lombok.Setter;

/**
 * @ClassName AreaCodeQueryDto
 * @Author tan.zj
 * @Date 2018/8/21
 **/
@Getter
@Setter
public class AreaCodeQueryDto {

    private Long houseId;

    private Long userId;

    private String areaCodes;

}
