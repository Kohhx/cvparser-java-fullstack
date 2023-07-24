import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";

 // Trying out
 function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

const mappedResumeforWordOutput = (resume) => {
  const newCompaniesDetail = resume.companiesDetails.map((cd) => {
    const newResponsibilities = cd.responsibilities.map((r) => ({
      responsibility: r,
    }));

    return {
      ...cd,
      noOfYears: parseFloat(cd.noOfYears).toFixed(1),
      responsibilities: newResponsibilities,
    };
  });

  const newSpokenLanguages = resume.spokenLanguages.map((sl) => ({
    spokenLanguage: sl,
  }));
  const newPrimarySkills = resume.primarySkills.map((ps) => ({
    primarySkill: ps,
  }));
  const newSecondarySkills = resume.secondarySkills.map((ss) => ({
    secondarySkill: ss,
  }));
  return {
    ...resume,
    companiesDetails: newCompaniesDetail,
    spokenLanguages: newSpokenLanguages,
    primarySkills: newPrimarySkills,
    secondarySkills: newSecondarySkills,
  };
};

export const wordUtil = {
  generateDocx: async (resume) => {
    const mappedResume = mappedResumeforWordOutput(resume);
     await loadFile(
      "https://res.cloudinary.com/duadcuueg/raw/upload/v1689584731/template_4_qj4qmd.docx",
      function (error, content) {
        if (error) {
          throw error;
        }
        var zip = new PizZip(content);
        var doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: false,
        });
        doc.setData(mappedResume);
        try {
          // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
          doc.render();
        } catch (error) {
          // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
          function replaceErrors(key, value) {
            if (value instanceof Error) {
              return Object.getOwnPropertyNames(value).reduce(function (
                error,
                key
              ) {
                error[key] = value[key];
                return error;
              },
              {});
            }
            return value;
          }
          console.log(JSON.stringify({ error: error }, replaceErrors));

          if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors
              .map(function (error) {
                return error.properties.explanation;
              })
              .join("\n");
            console.log("errorMessages", errorMessages);
            // errorMessages is a humanly readable message looking like this :
            // 'The tag beginning with "foobar" is unopened'
          }
          throw error;
        }
        var out = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }); //Output the document using Data-URI
        saveAs(out, `${resume.filename}.docx`);
      }
    );

  }
}
