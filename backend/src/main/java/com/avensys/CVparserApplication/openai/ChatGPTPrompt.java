package com.avensys.CVparserApplication.openai;

public class ChatGPTPrompt {
    public final static String GPTPROMPT1 =
            """
                       Please help me extract the following fields from each CV and use the followings as the keys:
                                name (string): The name of the candidate. Letter of each word is capital, the rest are lowercase.
                                email (string): The email address of the candidate.
                                mobile (string): The mobile number of the candidate.
                                skills (array): The skills possessed by the candidate. 
                                yearsOfExperience (number): The number of years of job experience of the candidate only.Exclude education and trainings. Please calculate the total number of year if he is working till present/current year which is 2023.
                                companies (array): The names of the recent 3 companies the candidate has worked for.
                                                
                                Please return only the JSON format. Please do not return any other strings. Ensure that the JSON format is valid.       
                                                   
                    """;

    public final static String GPTPROMPT2 =
            """
                       Please help me extract the following fields from a part of a CV and use the followings as the keys:
                                name (string): The name of the candidate. Letter of each word is capital, the rest are lowercase. If not provided, return empty.
                                email (string): The email address of the candidate. If not provided, return empty.
                                mobile (string): The mobile number of the candidate. If not provided, return empty.
                                skills (array): The skills possessed by the candidate.
                                yearsOfExperience (number): The number of years of job experience.
                                companies (array): The names of the recent 3 companies the candidate has worked for.
                                                
                                Please return only the JSON format. Please do not return any other strings.  
                                Please return only the JSON format. Please do not return any other strings in the response.  Ensure that the JSON format is valid.
                                The following text is only a portion of a CV.
                                            
                    """;

    public final static String GPTPROMPT3 =
            """
                      Please help me extract the following fields from each CV and use the followings as the keys:\s
                                                     name (string): The name of the candidate. Letter of each word is capital, the rest are lowercase.\s
                                                     firstName (string): The first name of the candidate. Letter of each word is capital, the rest are lowercase.\s
                                                     lastName (string): The last name of the candidate. Letter of each word is capital, the rest are lowercase.\s
                                                     gender (string): The gender of the candidate, return either "male" or "female". If not present, try to guess from the name. \s
                                                     spokenLanguages (array): All the languages that the candidate speaks. If not present, return the language used to write this resume. \s
                                                     email (string): The email address of the candidate.\s
                                                     mobile (string): The mobile number of the candidate.\s
                                                     skills (array): The skills possessed by the candidate. All skills. If cannot find, infer his skills from resume content. \s
                                                     primarySkills (array): The skills possessed by the candidate, frequently appearing throughout the resume. Just technical skills and software skills, no linguistic languages.\s
                                                     secondarySkills (array): The skills possessed by the candidate, but doesn't show up in the primary skills.\s
                                                     currentLocation (string): return the candidate's current country he/she resides in. If not available, just use the location of the candidate latest employment.\s 
                                                     nationality (string): Return the nationality based on the country the candidate is born in. If not present, get the nationality from the currentLocation. \s
                                                     companiesDetails (array): return all the companies the candidate worked with including internships. Sort the array from the most recent to least recent in terms of endDate.\s
                                                     1)	name:(string) name of the company . If nothing, return "".
                                                     2)	startDate: (string) convert start date of employment to this format "04/2023" E.g 04/2023, if nothing, just use end date of previous job. If only year present, then return month to be jan.
                                                     3)	endDate: (string) end date. Convert format to output "03/2023" E.g 04/2023. If no end date, just use 06/2023, present == 06/2023. If only year present, then return month to be jan.
                                                     4)	noOfYears: (decimal) Number of employment years in the company. Else return 0.0. If start date is empty, then is 0. If there is only start date, then take it as 1 year.
                                                     5) jobTitle: The candidate's job title for this job. \s
                                                     6) responsibilities: (array) The candidate's responsibilities for this job. Get from resume. Do not paraphrase. \s
                                                     yearsOfExperience (number): Total employment in years including internship based on the information in companiesDetails (array). Convert all the months to years. Return only the total value only, but if there are overlapping months, do not double count. Verify by adding up all the noOfYears from companiesDetails array.
                                                     1)Exclude education and trainings.\s
                                                     2) If candidate mention only present date without start date, then calculate years based on the last working date to present.
                                                     3) If candidate mention start date to present date, then calculate years based on the start date to present date.
                                                     4) Present year is 2023.
                                                     5) Employment dates for each position mentioned in your career history. Include the month and year for both the start and end dates of each job.
                                                     If any positions have unspecified employment dates, please mention that explicitly. Based on these, calculate the number of employment years of the candidate.
                                                     6) Please return number of years. Not months.
                                                     7) Always use candidate stated start date to end date first.
                                                     8) present always refer to end date.
                                                     companies (array): The names of the recent 3 companies the candidate has worked for. Do not return duplicate companies.
                                                     education (string): Give me the candidate highest education qualification in the resume.
                                                     jobTitle (string): return the candidate's job title of his/her latest job in the companiesDetail.
                                                     profile (string): return the about me section about the candidate from the resume else summarize into a readable paragraph. 
                                                     educationDetails (array): return all the education, institution and qualification. Sort the array from the most recent to least recent in terms of endDate. \s
                                                     1)	name:(string) name of the institution . If nothing, return "".
                                                     2)	startDate: (string) start date education typically in the format "month/year" E.g 04/2023. If only year present, then return month to be jan.
                                                     3)	endDate: (string) end date. Use this format for output "month/year" E.g 04/2023. If no end date, just use 06/2023, present == 06/2023. If only year present, then return month to be jan.
                                                     4)	noOfYears: (decimal) Number of education years in the institution. Else return 0.0. If start date is empty, then is 0. If there is only start date, then take take it as 1 year.
                                                     5) qualification: The qualification of the education. \s
                                                     Please return only the JSON format. Please do not return any other strings. Ensure that the JSON format is valid and complete according to the above requirements.The following is a chunk of a CV.
                                                     Complete the response before returning the response. For any empty results, reparse the resume again and get a result.
                    """;



    public final static String GPTPROMPT3_2 =
            """
                                
                    Above is the result from previous response. Use this as the input for the next response. Add the new extracted information to this and merge them to give the final JSON output.
                           
                            """;

    private final String GPTPROMPT3BK =
            """
                    Please help me extract the following fields from each CV and use the followings as the keys:\s
                                                     name (string): The name of the candidate. Letter of each word is capital, the rest are lowercase.\s
                                                     email (string): The email address of the candidate.\s
                                                     mobile (string): The mobile number of the candidate.\s
                                                     skills (array): The skills possessed by the candidate. Both technical skills and soft skills.
                                                     companiesDetails (array): All the companies the candidate worked with.
                                                     1)	name:(string) name of the company 
                                                     2)	startDate: (string) start date 
                                                     3)	endDate: (string) end date || Jan 2023 || if present, then Jan 2023
                                                     4)	noOfYears: (decimal) Number of employment years in the company. Else 0.0. If start date is empty, then is 0\s
                                                     yearsOfExperience (number): Total employment in years based on the information in companiesDetails (array). Convert all the months to years. Return only the total value only. Verify by adding up all the noOfYears from companiesDetails array.
                                                     1)Exclude education and trainings.\s
                                                     2) If candidate mention only present date without start date, then calculate years based on the last working date to present.
                                                     3) If candidate mention start date to present date, then calculate years based on the start date to present date.
                                                     4) Present year is 2023.
                                                     5) Employment dates for each position mentioned in your career history. Include the month and year for both the start and end dates of each job.
                                                     If any positions have unspecified employment dates, please mention that explicitly. Based on these, calculate the number of employment years of the candidate.
                                                     6) Please return number of years. Not months.
                                                     7) Always use candidate stated start date to end date first.
                                                     8) present always refer to end date.
                                                     companies (array): The names of the recent 3 companies the candidate has worked for.
                                                     
                                                     Please return only the JSON format. Please do not return any other strings. Ensure that the JSON format is valid.
                    """;

    private final String GPTPROMPT3Bk2 =
            """
                    Please help me extract the following fields from each CV and use the followings as the keys:\s
                                                     name (string): The name of the candidate. Letter of each word is capital, the rest are lowercase.\s
                                                     email (string): The email address of the candidate.\s
                                                     mobile (string): The mobile number of the candidate.\s
                                                     skills (array): The skills possessed by the candidate. Both technical skills and soft skills.
                                                     companiesDetails (array): All the companies the candidate worked with including internships. Array should start with the latest.
                                                     1)	name:(string) name of the company . If nothing, return "".
                                                     2)	startDate: (string) start date in this format month/year If nothing, return "".
                                                     3)	endDate: (string) end date or if no end date, present is Jan 2023. Use this format for output month/year If nothing, return "".
                                                     4)	noOfYears: (decimal) Number of employment years in the company. Else return 0.0. If start date is empty, then is 0\s
                                                     yearsOfExperience (number): Total employment in years including internship based on the information in companiesDetails (array). Convert all the months to years. Return only the total value only. Verify by adding up all the noOfYears from companiesDetails array.
                                                     1)Exclude education and trainings.\s
                                                     2) If candidate mention only present date without start date, then calculate years based on the last working date to present.
                                                     3) If candidate mention start date to present date, then calculate years based on the start date to present date.
                                                     4) Present year is 2023.
                                                     5) Employment dates for each position mentioned in your career history. Include the month and year for both the start and end dates of each job.
                                                     If any positions have unspecified employment dates, please mention that explicitly. Based on these, calculate the number of employment years of the candidate.
                                                     6) Please return number of years. Not months.
                                                     7) Always use candidate stated start date to end date first.
                                                     8) present always refer to end date.
                                                     companies (array): The names of the recent 3 companies the candidate has worked for.
                                                     
                                                     Please return only the JSON format. Please do not return any other strings. Ensure that the JSON format is valid and complete according to the above requirements.The following is a chunk of a CV.
                                                     Complete the response before returning the response.
                    """;

    private final String GPTPROMPT3_3BK =
            """
                    Please help me extract the following fields from each CV and use the followings as the keys:\s
                                                     name (string): The name of the candidate. Letter of each word is capital, the rest are lowercase.\s
                                                     email (string): The email address of the candidate.\s
                                                     mobile (string): The mobile number of the candidate.\s
                                                     skills (array): The skills possessed by the candidate. Just technical skills, and no linguistic languages.
                                                     companiesDetails (array): All the companies the candidate worked with including internships. Array should start with the latest.
                                                     1)	name:(string) name of the company . If nothing, return "".
                                                     2)	startDate: (string) start date in this format "month/year" If nothing, return "". 
                                                     3)	endDate: (string) end date. Use this format for output "month/year". Present date is jun 2023. If there is no end date, you can determine if end date should be present date based on the resume or just till the end of year of start date.
                                                     4)	noOfYears: (decimal) Number of employment years in the company. Else return 0.0. If start date is empty, then is 0. If there is only start date, then take take it as 1 year.
                                                     yearsOfExperience (number): Total employment in years including internship based on the information in companiesDetails (array). Convert all the months to years. Return only the total value only. Verify by adding up all the noOfYears from companiesDetails array.
                                                     1)Exclude education and trainings.\s
                                                     2) If candidate mention only present date without start date, then calculate years based on the last working date to present.
                                                     3) If candidate mention start date to present date, then calculate years based on the start date to present date.
                                                     4) Present year is 2023.
                                                     5) Employment dates for each position mentioned in your career history. Include the month and year for both the start and end dates of each job.
                                                     If any positions have unspecified employment dates, please mention that explicitly. Based on these, calculate the number of employment years of the candidate.
                                                     6) Please return number of years. Not months.
                                                     7) Always use candidate stated start date to end date first.
                                                     8) present always refer to end date.
                                                     companies (array): The names of the recent 3 companies the candidate has worked for. Do not return duplicate companies.
                                                     education (string): Give me the candidate highest education qualification in the resume.
                                                     
                                                     Please return only the JSON format. Please do not return any other strings. Ensure that the JSON format is valid and complete according to the above requirements.The following is a chunk of a CV.
                                                     Complete the response before returning the response.
                    """;

    private final String GPTPROMPT3_4BK =
            """
                    Please help me extract the following fields from each CV and use the followings as the keys:\s
                                                     name (string): The name of the candidate. Letter of each word is capital, the rest are lowercase.\s
                                                     email (string): The email address of the candidate.\s
                                                     mobile (string): The mobile number of the candidate.\s
                                                     skills (array): The skills possessed by the candidate. Just technical skills and software skills, no linguistic languages.
                                                     companiesDetails (array): All the companies the candidate worked with including internships. Array should start with the latest.
                                                     1)	name:(string) name of the company . If nothing, return "".
                                                     2)	startDate: (string) start date of employment typically in the format "month/year", if nothing, just use end date of previous job.
                                                     3)	endDate: (string) end date. Use this format for output "month/year". If no end date, just use 2023-06, present == 2023-06
                                                     4)	noOfYears: (decimal) Number of employment years in the company. Else return 0.0. If start date is empty, then is 0. If there is only start date, then take take it as 1 year.
                                                     yearsOfExperience (number): Total employment in years including internship based on the information in companiesDetails (array). Convert all the months to years. Return only the total value only, but if there are overlapping months, do not double count. Verify by adding up all the noOfYears from companiesDetails array.
                                                     1)Exclude education and trainings.\s
                                                     2) If candidate mention only present date without start date, then calculate years based on the last working date to present.
                                                     3) If candidate mention start date to present date, then calculate years based on the start date to present date.
                                                     4) Present year is 2023.
                                                     5) Employment dates for each position mentioned in your career history. Include the month and year for both the start and end dates of each job.
                                                     If any positions have unspecified employment dates, please mention that explicitly. Based on these, calculate the number of employment years of the candidate.
                                                     6) Please return number of years. Not months.
                                                     7) Always use candidate stated start date to end date first.
                                                     8) present always refer to end date.
                                                     companies (array): The names of the recent 3 companies the candidate has worked for. Do not return duplicate companies.
                                                     education (string): Give me the candidate highest education qualification in the resume.
                                                     
                                                     Please return only the JSON format. Please do not return any other strings. Ensure that the JSON format is valid and complete according to the above requirements.The following is a chunk of a CV.
                                                     Complete the response before returning the response.
                    """;

}
