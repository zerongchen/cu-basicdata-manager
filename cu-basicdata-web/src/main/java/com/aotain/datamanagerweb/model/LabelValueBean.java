package com.aotain.datamanagerweb.model;

public class LabelValueBean implements java.io.Serializable {

	private static final long serialVersionUID = -1384988812720447808L;

	private String itemLabel;

	private String itemValue;
	
	

	public LabelValueBean() {
	}
	
	public LabelValueBean(String itemLabel, String itemValue) {
		super();
		this.itemLabel = itemLabel;
		this.itemValue = itemValue;
	}

	public String getItemLabel() {
		return itemLabel;
	}

	public void setItemLabel(String label) {
		this.itemLabel = label;
	}

	public String getItemValue() {
		return itemValue;
	}

	public void setItemValue(String value) {
		this.itemValue = value;
	}

	@Override
	public String toString() {
		return "LabelValueBean [" + itemLabel + ", " + itemValue + "]";
	}

}
