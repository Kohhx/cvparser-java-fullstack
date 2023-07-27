package com.avensys.CVparserApplication.utility;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.tika.Tika;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.sax.BodyContentHandler;
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
        return fileName.substring(0, dotIndex);
    }

    public static String extractJsonFromString(String input) {
        ObjectMapper mapper = new ObjectMapper();

        int startIndex = input.indexOf("{");
        int endIndex = input.lastIndexOf("}");

        if (startIndex != -1 && endIndex != -1) {
            String jsonString = input.substring(startIndex, endIndex + 1);
            try {
                // Parsing the JSON string to validate if it's a valid JSON
                JsonNode jsonNode = mapper.readTree(jsonString);
                return jsonString;
            } catch (Exception e) {
                // The substring is not a valid JSON
                e.printStackTrace();
            }
        }

        return null; // JSON not found in the input string or it's malformed
    }

    public static String parseFileToString(MultipartFile file) {
        try {
            // Create an instance of AutoDetectParser
            Parser parser = new AutoDetectParser();

            // Create a handler to store the extracted content
            BodyContentHandler handler = new BodyContentHandler();

            Metadata metadata = new Metadata();

            // Create a context to hold parsing configuration
            ParseContext context = new ParseContext();

            // Parse the file and extract the content
            parser.parse(file.getInputStream(), handler, metadata, context);
            System.out.println(handler.toString());
            // Return the extracted text content
            return handler.toString();
        } catch (Exception e) {
            // Handle any exceptions
            e.printStackTrace();
            // Return an error message or throw an exception
            return null;
        }
    }

}
