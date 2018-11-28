package com.aotain.datamanagerweb.utils.dataimport;


public class ImportErrorData {
	
	private int sheet; //sheet 表

	private int row; //行

	private String[] content; //文件内容
	
	private String dataErrorInfo; //错误信息

	public ImportErrorData(int sheet,int row,String[] content,String dataErrorInfo){
		this.sheet=sheet;
		this.row=row;
		this.content=content;
		this.dataErrorInfo=dataErrorInfo;
	}
	public ImportErrorData(){

	}

	public int getSheet() {
		return sheet;
	}

	public void setSheet( int sheet ) {
		this.sheet = sheet;
	}

	public int getRow() {
		return row;
	}

	public void setRow( int row ) {
		this.row = row;
	}

	public String[] getContent() {
		return content;
	}

	public void setContent( String[] content ) {
		this.content = content;
	}

	public String getDataErrorInfo() {
		return dataErrorInfo;
	}

	public void setDataErrorInfo( String dataErrorInfo ) {
		this.dataErrorInfo = dataErrorInfo;
	}
}
