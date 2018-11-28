package com.aotain.datamanagerweb.utils;

import com.aotain.common.config.LocalConfig;
import com.aotain.datamanagerweb.service.handlefile.FileHandleServiceImpl;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URL;
import java.net.URLDecoder;
import java.util.Date;
import java.util.List;

public class FileTools {

    private static final Logger logger = LoggerFactory.getLogger(FileHandleServiceImpl.class);

    public static void exportTemplete( HttpServletRequest request, HttpServletResponse response, final String fileName,String exportName) {

        InputStream input = null;
        OutputStream output = null;
        try {
            String filePath = System.getProperty("user.dir")+"/template/";
            File folder = new File(filePath);
            File[] templates = folder.listFiles(new FilenameFilter() {
                @Override
                public boolean accept(File dir, String name) {
                    if (FilenameUtils.getBaseName(name).equals(fileName)) {
                        return true;
                    }
                    return false;
                }
            });
            File fileTemplete = templates[0];

            exportName = getFileNameDisplay(exportName, request) +"."+ FilenameUtils.getExtension(fileTemplete.getAbsolutePath());
            response.addHeader("Content-Disposition", "attachment;filename=" + exportName);
            input = new BufferedInputStream(new FileInputStream(fileTemplete));
            output = new BufferedOutputStream(response.getOutputStream());
            IOUtils.copy(input, output);
            output.flush();
        } catch (Exception e) {
            logger.error("export Template error",e);
        } finally {
            IOUtils.closeQuietly(input);
            IOUtils.closeQuietly(output);
        }
    }

    public static void exportFile( HttpServletRequest request, HttpServletResponse response, final String fileName, final String filePath) {

        InputStream input = null;
        OutputStream output = null;
        try {
            File folder = new File(filePath);
            File[] templates = folder.listFiles(new FilenameFilter() {
                @Override
                public boolean accept(File dir, String name) {
                    if (FilenameUtils.getBaseName(name).trim().equals(fileName)) {
                        return true;
                    }
                    return false;
                }
            });
            if(templates.length>0){
                File fileTemplete = templates[0];
                String fileNameDisplay = getFileNameDisplay(fileName, request) + "." + FilenameUtils.getExtension(fileTemplete.getAbsolutePath());
                response.addHeader("Content-Disposition", "attachment;filename=" + fileNameDisplay);
                input = new BufferedInputStream(new FileInputStream(fileTemplete));
                output = new BufferedOutputStream(response.getOutputStream());
                IOUtils.copy(input, output);
                output.flush();
            }else{
                logger.error("no file to download,fileName="+fileName);
            }
        } catch (Exception e) {
            logger.error("export file error",e);
        } finally {
            IOUtils.closeQuietly(input);
            IOUtils.closeQuietly(output);
        }
    }

    public static void exportErrorFile( HttpServletRequest request, HttpServletResponse response, String fileName,final String chileDir) {
        String filePath = System.getProperty("user.dir")+File.separator+"error"+File.separator+chileDir;
        fileName = URLDecoder.decode(fileName);
        exportFile(request,response,fileName,filePath);
    }

    /**
     *
     * @Title: exportData
     * @Description: 导出excel保存到本地
     * @param @param dataList
     * @param @param classList
     * @param @param fileName
     * @return void
     * @throws
     */
    public static String exportData( List<List<?>> dataList, List<Class<?>> classList, String fileName, HttpServletResponse response, HttpServletRequest request) {
        try {
            OutputStream output = response.getOutputStream();
            fileName = fileName+ DateUtils.formatCurrDateyyyyMMddHHmmss() +".xlsx";
            String fileNameDisplay = getFileNameDisplay(fileName, request) ;
            response.setContentType("application/octet-stream");
            response.setCharacterEncoding("UTF-8");
            response.addHeader("Content-Disposition", "attachment;filename=" + fileNameDisplay);
            ExcelUtil.createExcel(dataList, classList,output,fileNameDisplay);
            return fileName;
        } catch (Exception e) {
            logger.error("export "+fileName+" data "+e);
            return "";
        }

    }

    private static String getFileNameDisplay(String fileName, HttpServletRequest request) throws Exception {
        if ("FF".equals(getBrowser(request))) { // 针对火狐浏览器处理方式不一样了
            return new String(fileName.getBytes("UTF-8"),  "iso-8859-1");
        }
        return toUtf8String(fileName); // 解决汉字乱码
    }

    public static String toUtf8String(String s){
        StringBuffer sb = new StringBuffer();
        for (int i=0;i<s.length();i++){
            char c = s.charAt(i);
            if (c >= 0 && c <= 255){
                sb.append(c);
            }else{
                byte[] b;
                try {
                    b = Character.toString(c).getBytes("utf-8");
                }catch (Exception ex) {
                    logger.error("toUtf8String error",ex);
                    b = new byte[0];
                }
                for (int j = 0; j < b.length; j++) {
                    int k = b[j];
                    if (k < 0) k += 2<<(8-1);
                    sb.append("%" + Integer.toHexString(k).toUpperCase());
                }
            }
        }
        return sb.toString();
    }
    public static void uploadFile( HttpServletRequest request, HttpServletResponse response, final String fileName) {

        InputStream input = null;
        OutputStream output = null;
        try {
            String filePath = System.getProperty("user.dir")+"/downLoad/";
            File folder = new File(filePath);
            File[] templates = folder.listFiles(new FilenameFilter() {
                @Override
                public boolean accept(File dir, String name) {
                    if (FilenameUtils.getBaseName(name).equals(fileName)) {
                        return true;
                    }
                    return false;
                }
            });
            File fileTemplete = null;
            if(templates.length<=0) {
                fileTemplete = new File(filePath+fileName+"-1.xlsx");
            }else {
                fileTemplete = templates[0];
            }

            String fileNameDisplay = getFileNameDisplay(fileName, request) +DateUtils.formatDateyyyyMMdd(new Date())+"." + FilenameUtils.getExtension(fileTemplete.getAbsolutePath());
            response.addHeader("Content-Disposition", "attachment;filename=" + fileNameDisplay);
            input = new BufferedInputStream(new FileInputStream(fileTemplete));
            output = new BufferedOutputStream(response.getOutputStream());
            IOUtils.copy(input, output);
            output.flush();
        } catch (Exception e) {
            logger.error("uploadFile error ",e);
        } finally {
            IOUtils.closeQuietly(input);
            IOUtils.closeQuietly(output);
        }
    }

    public static void uploadFile( HttpServletRequest request, HttpServletResponse response, final String fileName, String realName) {

        InputStream input = null;
        OutputStream output = null;
        try {
            String filePath = System.getProperty("user.dir")+"/downLoad/";
            File folder = new File(filePath);
            File[] templates = folder.listFiles(new FilenameFilter() {
                @Override
                public boolean accept(File dir, String name) {
                    if (FilenameUtils.getBaseName(name).equals(fileName)) {
                        return true;
                    }
                    return false;
                }
            });
            File fileTemplete = null;
            if(templates.length<=0) {
                fileTemplete = new File(filePath+fileName+"-1.xlsx");
            }else {
                fileTemplete = templates[0];
            }

            String fileNameDisplay = getFileNameDisplay(realName, request) +DateUtils.formatDateyyyyMMdd(new Date())+"." + FilenameUtils.getExtension(fileTemplete.getAbsolutePath());
            response.addHeader("Content-Disposition", "attachment;filename=" + fileNameDisplay);
            input = new BufferedInputStream(new FileInputStream(fileTemplete));
            output = new BufferedOutputStream(response.getOutputStream());
            IOUtils.copy(input, output);
            output.flush();
        } catch (Exception e) {
            logger.error("uploadFile error",e);
        } finally {
            IOUtils.closeQuietly(input);
            IOUtils.closeQuietly(output);
        }
    }

    public static String getFileNameByFilterAndRemove(String path, String str ) {


        String filePath = path;
        File folder = new File(filePath);
        final String filterString  = str;
        File[] templates = folder.listFiles(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String name) {
                if (FilenameUtils.getBaseName(name).indexOf(filterString)>-1) {
                    return true;
                }
                return false;
            }
        });
        if(templates.length<1){
            return null;
        }
        File file = templates[0];
        file.delete();
        return file.getName();
    }


    public static void downLoadFile( HttpServletRequest request, HttpServletResponse response, String path, String fileName) {
        InputStream input = null;
        OutputStream output = null;
        try {
            String filePath = System.getProperty("user.dir")+"/"+path+"/"+fileName;
            File fileTemplete = new File(filePath);
            String fileNameDisplay = getFileNameDisplay(fileName, request);
            response.setHeader("Content-Disposition", "attachment;filename=" + fileNameDisplay);
            input = new BufferedInputStream(new FileInputStream(fileTemplete));
            output = new BufferedOutputStream(response.getOutputStream());
            IOUtils.copy(input, output);
            output.flush();
        } catch (Exception e) {
            logger.error("download error "+e);
            constructErrorMsg(input,output,response);
        } finally {
            IOUtils.closeQuietly(input);
            IOUtils.closeQuietly(output);
        }
    }

    public static void exportDataWithtemplate(HttpServletRequest request, HttpServletResponse response, List<List<?>> dataList, List<Class<?>> classList, String fileName,String template) {

            File folder = new File(System.getProperty("user.dir")+File.separatorChar+"template");
            File[] templates = folder.listFiles(new FilenameFilter() {
                @Override
                public boolean accept(File dir, String name) {
                    if (FilenameUtils.getBaseName(name).equals(template)) {
                        return true;
                    }
                    return false;
                }
            });
            if (templates == null || templates.length<1) {
                // TODO：返回错误处理
                return ;
            }
            File file = templates[0];
            InputStream input = null;
            OutputStream output = null;
            try {
                String newFileName = fileName + "-" + System.currentTimeMillis() + "." + FilenameUtils.getExtension(file.getAbsolutePath());
                String exportFilePath = System.getProperty("user.dir")+File.separatorChar+"export";
                if (!exportFilePath.endsWith(File.separator)) {
                    exportFilePath += File.separator;
                }
                File dir = new File(exportFilePath);
                if (!dir.exists()){
                    dir.mkdirs();
                }
                IOUtils.copy(new FileInputStream(file), new FileOutputStream(exportFilePath + newFileName));
                ExcelUtil.createExcelWithTemplate(dataList, classList, exportFilePath, newFileName);
                String fileNameDisplay = getFileNameDisplay(fileName, request) + "." + FilenameUtils.getExtension(file.getAbsolutePath());
                response.setContentType("application/octet-stream");
                response.addHeader("Content-Disposition", "attachment;filename=" + fileNameDisplay);
                input = new BufferedInputStream(new FileInputStream(new File(exportFilePath + newFileName)));
                output = new BufferedOutputStream(response.getOutputStream());
                IOUtils.copy(input, output);
                output.flush();
            } catch (Exception e) {
                logger.error("export error",e);
            } finally {
                IOUtils.closeQuietly(input);
                IOUtils.closeQuietly(output);
            }
    }


    private static void constructErrorMsg(InputStream in,OutputStream out, HttpServletResponse response){
        try {
            String msg = "<a href=\"javascript:history.go(-1);\">该文件不存在,或者已经被移走了</a>";
            InputStream   in_msg   =   new   ByteArrayInputStream(msg.getBytes());
            response.reset();
            response.setCharacterEncoding("UTF-8");
            response.setHeader("Content-Type", "text/html;charset=UTF-8");
            out = new BufferedOutputStream(response.getOutputStream());
            IOUtils.copy(in_msg, out);
        } catch (IOException e) {
            logger.error("write response "+e);
        } finally {
            IOUtils.closeQuietly(in);
            IOUtils.closeQuietly(out);
        }

    }

    /**
     *
     * @Title: saveFile
     * @Description: 保存文件到服务器
     * @param @param request
     * @param @param fileName 上传文件form表单中名称
     * @param @param childDir 要保存的文件名，尽量以自己功能命名
     * @param @return
     * @return String
     * @throws
     */
    public static String saveFile( HttpServletRequest request, String fileName, String childDir) {
        MultipartFile file = ((MultipartRequest)request).getFile(fileName);
        String fileSaveName =file.getOriginalFilename();
        try {

            String filePath = System.getProperty("user.dir")+"/save/"+ childDir+"/";
            File folder = new File(filePath);
            if(!folder.exists()) {
               // folder.mkdir();
                folder.mkdirs();
            }
            fileSaveName = fileSaveName.substring(0,fileSaveName.lastIndexOf(".")) + "_" + String.valueOf(System.currentTimeMillis())+fileSaveName.substring(fileSaveName.lastIndexOf("."),fileSaveName.length());
            file.transferTo(new File(filePath+fileSaveName));
            logger.info("导入,保存导入文件{"+file.getOriginalFilename()+"} 到 "+filePath+childDir+" success");
        } catch (Exception e) {
            logger.error("导入,保存导入文件{"+file.getOriginalFilename() +" failure,e="+e);
            return null;
        }
        return fileSaveName;
    }

    public static String saveFile2( HttpServletRequest request, String fileName, String saveName) {
        MultipartFile file = ((MultipartRequest)request).getFile(fileName);
        try {
            saveName = saveName + String.valueOf(System.currentTimeMillis())+".xlsx";
            String filePath = System.getProperty("user.dir")+"/downLoad/"+ DateUtils.formatDateyyyyMMdd(new Date())+"/";
            File folder = new File(filePath);
            if(!folder.exists()) {
                folder.mkdir();
            }
            file.transferTo(new File(filePath+saveName));
            logger.info("导入,保存导入文件{"+file.getOriginalFilename()+"} 到 "+filePath+saveName+" success");
        } catch (Exception e) {
            logger.info("导入,保存导入文件{"+file.getOriginalFilename() +" failure,e="+e);
        }
        return saveName;
    }

    private static String getBrowser(HttpServletRequest request) {
        String UserAgent = request.getHeader("USER-AGENT").toLowerCase();
        if (UserAgent != null) {
            if (UserAgent.indexOf("msie") >= 0)
                return "IE";
            if (UserAgent.indexOf("firefox") >= 0)
                return "FF";
            if (UserAgent.indexOf("safari") >= 0)
                return "SF";
        }
        return null;
    }
}
