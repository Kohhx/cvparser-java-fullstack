package com.avensys.CVparserApplication.openai;

public class CompaniesDetails {
    private String name;
    private String startDate;
    private String endDate;
    private double noOfYears;

    public CompaniesDetails() {
    }

    public CompaniesDetails(String name, String startDate, String endDate, double noOfYears) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.noOfYears = noOfYears;
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
}
