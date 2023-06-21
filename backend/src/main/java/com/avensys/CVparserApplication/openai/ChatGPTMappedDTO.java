package com.avensys.CVparserApplication.openai;

public class ChatGPTMappedDTO {

    private String name;

    private String email;

    private String mobile;

    private int yearsOfExperience;

    private String[] skills;

    private String[] companies;

    public ChatGPTMappedDTO() {};

    public ChatGPTMappedDTO(String name, String email, String mobile, int yearsOfExperience, String[] skills, String[] companies) {
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.yearsOfExperience = yearsOfExperience;
        this.skills = skills;
        this.companies = companies;
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
}
