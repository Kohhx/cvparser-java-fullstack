package com.avensys.CVparserApplication.openai;

import java.util.ArrayList;
import java.util.List;

public class ChatGPTMappedDTO {

    private String name;

    private String email;

    private String mobile;

    private double yearsOfExperience;

    private String[] skills;

    private String[] companies;

    private List<CompaniesDetails> companiesDetails = new ArrayList<>();

    private String education;

    private String firstName;
    private String lastName;
    private String gender;
    private String currentLocation;
    private String nationality;
    private String jobTitle;
    private String profile;

    private List<String> spokenLanguages = new ArrayList<>();

    private List<String> primarySkills = new ArrayList<>();

    private List<String> secondarySkills = new ArrayList<>();

    public ChatGPTMappedDTO() {};

    public ChatGPTMappedDTO(String name, String email, String mobile, double yearsOfExperience, String[] skills, String[] companies, List<CompaniesDetails> companiesDetails, String education, String firstName, String lastName, String gender, String currentLocation, String nationality, String jobTitle, String profile, List<String> spokenLanguages, List<String> primarySkills, List<String> secondarySkills) {
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.yearsOfExperience = yearsOfExperience;
        this.skills = skills;
        this.companies = companies;
        this.companiesDetails = companiesDetails;
        this.education = education;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.currentLocation = currentLocation;
        this.nationality = nationality;
        this.jobTitle = jobTitle;
        this.profile = profile;
        this.spokenLanguages = spokenLanguages;
        this.primarySkills = primarySkills;
        this.secondarySkills = secondarySkills;
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

    public double getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(double yearsOfExperience) {
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

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getCurrentLocation() {
        return currentLocation;
    }

    public void setCurrentLocation(String currentLocation) {
        this.currentLocation = currentLocation;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getProfile() {
        return profile;
    }

    public void setProfile(String profile) {
        this.profile = profile;
    }

    public List<String> getSpokenLanguages() {
        return spokenLanguages;
    }

    public void setSpokenLanguages(List<String> spokenLanguages) {
        this.spokenLanguages = spokenLanguages;
    }

    public List<String> getPrimarySkills() {
        return primarySkills;
    }

    public void setPrimarySkills(List<String> primarySkills) {
        this.primarySkills = primarySkills;
    }

    public List<String> getSecondarySkills() {
        return secondarySkills;
    }

    public void setSecondarySkills(List<String> secondarySkills) {
        this.secondarySkills = secondarySkills;
    }
}
