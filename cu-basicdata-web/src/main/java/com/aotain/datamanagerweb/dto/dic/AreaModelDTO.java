package com.aotain.datamanagerweb.dto.dic;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class AreaModelDTO implements Serializable {

    private static final long serialVersionUID = -1;

    private List<AreaModel> provinceArr;
    private List<AreaModel> cityArr;
    private List<AreaModel> countyArr;

}
