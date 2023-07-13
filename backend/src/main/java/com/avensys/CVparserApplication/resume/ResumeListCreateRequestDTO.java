package com.avensys.CVparserApplication.resume;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class ResumeListCreateRequestDTO {
    private List<MultipartFile> fileList;

    public ResumeListCreateRequestDTO(List<MultipartFile> fileList) {
        this.fileList = fileList;
    }

    public List<MultipartFile> getFileList() {
        return fileList;
    }

    public void setFileList(List<MultipartFile> fileList) {
        this.fileList = fileList;
    }
}
