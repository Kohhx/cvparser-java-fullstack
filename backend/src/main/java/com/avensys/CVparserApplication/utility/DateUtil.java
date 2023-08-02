package com.avensys.CVparserApplication.utility;

public class DateUtil {

    public static double calculateNoOfYears(String startDate,String endDate) {
        String[] startDateArr = startDate.split("/");
        String[] endDateArr = endDate.split("/");

        int startMonth = Integer.parseInt(startDateArr[0]);
        int startYear = Integer.parseInt(startDateArr[1]);
        int endMonth = Integer.parseInt(endDateArr[0]);
        int endYear = Integer.parseInt(endDateArr[1]);

        // Calculate the total months difference
        int totalMonthsDifference = (endYear - startYear) * 12 + (endMonth - startMonth);

        // Calculate the year and month difference
        int yearDifference = totalMonthsDifference / 12;
        int monthDifference = totalMonthsDifference % 12;

        // Output the result
        System.out.println("Year Difference: " + yearDifference);
        System.out.println("Month Difference: " + monthDifference);
        double result = yearDifference + (monthDifference / 12.0);
        System.out.println("Total Months Difference: " + Double.parseDouble(String.format("%.2f", result)));


        return Double.parseDouble(String.format("%.2f", result));
    }
}
