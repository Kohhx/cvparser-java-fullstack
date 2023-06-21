package com.avensys.CVparserApplication.utility;

import org.apache.tika.Tika;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public class FileUtil {


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

    private static String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex == -1) {
            return "";
        }
        return fileName.substring(dotIndex);
    }

}
