package com.avensys.CVparserApplication.openai;

public class EducationDetails {
    private String name;
    private String startDate;
    private String endDate;
    private double noOfYears;
    private String qualification;

    public EducationDetails() {
    }

    public EducationDetails(String name, String startDate, String endDate, double noOfYears, String qualification) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.noOfYears = noOfYears;
        this.qualification = qualification;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public double getNoOfYears() {
        return noOfYears;
    }

    public void setNoOfYears(double noOfYears) {
        this.noOfYears = noOfYears;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }
}
