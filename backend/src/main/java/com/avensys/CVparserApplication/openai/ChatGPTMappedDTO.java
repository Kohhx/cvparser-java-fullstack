package com.avensys.CVparserApplication.openai;

import java.util.ArrayList;
import java.util.List;

public class ChatGPTMappedDTO {

    private String name;

    private String email;

    private String mobile;

    private int yearsOfExperience;

    private String[] skills;

    private String[] companies;

    private List<CompaniesDetails> companiesDetails = new ArrayList<>();

    public ChatGPTMappedDTO() {};

    public ChatGPTMappedDTO(String name, String email, String mobile, int yearsOfExperience, String[] skills, String[] companies, List<CompaniesDetails> companiesDetails) {
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.yearsOfExperience = yearsOfExperience;
        this.skills = skills;
        this.companies = companies;
        this.companiesDetails = companiesDetails;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public int getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(int yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public String[] getSkills() {
        return skills;
    }

    public void setSkills(String[] skills) {
        this.skills = skills;
    }

    public String[] getCompanies() {
        return companies;
    }

    public void setCompanies(String[] companies) {
        this.companies = companies;
    }

    public List<CompaniesDetails> getCompaniesDetails() {
        return companiesDetails;
    }

    public void setCompaniesDetails(List<CompaniesDetails> companiesDetails) {
        this.companiesDetails = companiesDetails;
    }
}
