package com.avensys.CVparserApplication.utility;

import org.apache.tika.Tika;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public class FileUtil {

    public static boolean checkFileIsDocument(String fileName) {
        String ext = getFileExtension(fileName);
        if (ext.equals(".doc") || ext.equals(".docx") || ext.equals(".pdf")) {
            return true;
        }
        return false;
    }
    public static String getFileTypeMimeType(MultipartFile file) throws IOException {
        Tika tika = new Tika();
        String mimeType = tika.detect(file.getInputStream());
        return mimeType;
    }

    public static String getFileTypeFromExtension(String fileName) {
        String ext = getFileExtension(fileName);
        if (ext.equals(".png") || ext.equals(".jpg") ||
                ext.equals(".jpeg") || ext.equals(".gif") ||
                ext.equals(".bmp")) {
            return "image";
        }

        if (ext.equals(".mp4") || ext.equals(".mov") ||
                ext.equals(".avi") || ext.equals(".mkv") ||
                ext.equals(".flv") || ext.equals(".wmv") ||
                ext.equals(".webm") || ext.equals(".m4v") ||
                ext.equals(".mpeg")) {
            return "video";
        }

        return "";
    }

    public static String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex == -1) {
            return "";
        }
        return fileName.substring(dotIndex);
    }

    public static String getFileName(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex == -1) {
            return "";
        }
        return fileName.substring(0,dotIndex);
    }


}
