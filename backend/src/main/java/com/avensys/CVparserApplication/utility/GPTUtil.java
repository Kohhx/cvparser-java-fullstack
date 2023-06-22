package com.avensys.CVparserApplication.utility;

import java.util.Arrays;

public class GPTUtil {

    public static int countTokens(String text) {
        // Split the text into tokens based on whitespace and punctuation
        String[] tokens = text.split("\\s+|(?=[.,!?])|(?<=[.,!?])");

        // Count the number of non-empty tokens
        int count = 0;
        for (String token : tokens) {
            if (!token.isEmpty()) {
                count++;
            }
        }
        return count;
    }

    public static String reduceToken(String token) {
        // Remove punctuation using regular expression
        String reducedToken = token.replaceAll("\\p{Punct}", "");
        return reducedToken;
    }

    public static String reduceToken2(String token) {
        // Define a list of stop words
        String[] stopWords = {"a", "an", "the", "in", "on", "at", "and", "or","and", "but", "or", "nor", "so", "yet", "for", "a", "an", "the", "in", "on", "at", "by", "to", "from", "of", "with", "without", "about", "above", "below", "over", "under", "between", "among", "through", "during", "before", "after", "since", "until", "while", "although", "though", "whether", "if", "unless", "because", "since", "now", "then", "once", "here", "there", "where", "when", "why", "how", "any", "some", "no", "every", "each", "all", "both", "neither", "either", "much", "many", "few", "fewer", "most", "more", "such", "same", "other", "another", "next", "last", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"};

        // Check if the token is a stop word
        if (Arrays.asList(stopWords).contains(token.toLowerCase())) {
            return "";
        } else {
            return token;
        }
    }

    public static String truncateString(String text, int maxTokenCount) {
        String[] tokens = text.split("\\s+|(?=[.,!?])|(?<=[.,!?])");
        StringBuilder truncatedText = new StringBuilder();

        int count = 0;
        for (String token : tokens) {
            if (count <= maxTokenCount) {
                truncatedText.append(token).append(" ");
                count += 1;
            } else {
                break;
            }
        }
        return truncatedText.toString().trim();
    }
}
