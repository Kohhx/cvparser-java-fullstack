package com.avensys.CVparserApplication.utility;

import com.avensys.CVparserApplication.openai.CompaniesDetails;
import com.avensys.CVparserApplication.openai.EducationDetails;

import java.util.Comparator;

public class ComparatorUtil {

    public static class DescendingCompaniesDateComparator implements Comparator<CompaniesDetails> {
        @Override
        public int compare(CompaniesDetails obj1, CompaniesDetails obj2) {
            String[] parts1 = obj1.getEndDate().split("/");
            String[] parts2 = obj2.getEndDate().split("/");

            int month1 = Integer.parseInt(parts1[0]);
            int year1 = Integer.parseInt(parts1[1]);
            int month2 = Integer.parseInt(parts2[0]);
            int year2 = Integer.parseInt(parts2[1]);

            if (year1 != year2) {
                return Integer.compare(year2, year1); // Compare years in descending order
            } else {
                return Integer.compare(month2, month1); // If years are equal, compare months in descending order
            }
        }
    }

    public static class DescendingEducationDateComparator implements Comparator<EducationDetails> {
        @Override
        public int compare(EducationDetails obj1, EducationDetails obj2) {
            String[] parts1 = obj1.getEndDate().split("/");
            String[] parts2 = obj2.getEndDate().split("/");

            int month1 = Integer.parseInt(parts1[0]);
            int year1 = Integer.parseInt(parts1[1]);
            int month2 = Integer.parseInt(parts2[0]);
            int year2 = Integer.parseInt(parts2[1]);

            if (year1 != year2) {
                return Integer.compare(year2, year1); // Compare years in descending order
            } else {
                return Integer.compare(month2, month1); // If years are equal, compare months in descending order
            }
        }
    }
}
