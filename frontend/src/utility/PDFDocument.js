import React, { useState } from "react";
import ReactDOM from "react-dom";

import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  viewer: {
    width: window.innerWidth, //the pdf viewer will take up all of the width and height
    height: window.innerHeight,
  },
  logoImage: {
    width: "150px",
    textAlign: "center",
    marginBottom: "12px",
  },
  container: {
    padding: "10px 10px 10px 10px",
  },
  page: {
    flexDirection: "column",
    backgroundColor: "white",
    padding: 20,
    paddingRight: 40,
    fontSize: 10,
  },
  section: {
    // margin: 10,
    // padding: 10,
    // flexGrow: 1,
    marginTop: 7,
    marginBottom: 7,
    display: "block",
  },
  title: {
    textAlign: "center",
    marginBottom: 2,
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: "red",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerRight: {
    // width: "200px"
  },
  line: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
    margin: "10px 0px 10px 0px",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 7,
    textDecoration: "underline",
  },
  sectionText: {
    fontSize: 14,
  },
  companySection: {
    // marginBottom: 3,
  },
  educationSection: {
    marginBottom: 4,
  },
  companyTitleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flexBottom: {
    alignSelf: "flex-end",
  },
  boldFont: {
    // fontFamily: 'sans-serif-Bold',
    // fontWeight: 900,
  },
  bulletPoint: {
    listStyle: "circle",
  },
  // text: {
  //   fontSize: 14,
  //   fontFamily: 'sans-serif',
  //   fontWeight: 'normal',
  //   color: '#000',
  // },
});

const PDFDocument = ({ data }) => {
  const [view, setView] = useState(false);
  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <Image
            style={styles.logoImage}
            src="https://res.cloudinary.com/duadcuueg/image/upload/v1689238754/FB3EDF63-E22C-44F9-99AF-F6FABAB6E7BF_4_5005_c_h075vu.jpg"
          />

          <View style={styles.headerContainer}>
            <View style={styles.flexBottom}>
              <Text style={styles.title}>
                <Text style={styles.boldFont}>Name:</Text> {data.firstName}
                {data.lastName}
              </Text>
              <Text style={styles.title}>Gender: {data.gender}</Text>
              <Text style={styles.title}>Nationality: {data.nationality}</Text>
              <Text style={styles.title}>Mobile: {data.mobile}</Text>
              <Text style={styles.title}>Email: {data.email}</Text>
            </View>

            <View style={[styles.flexBottom, styles.headerRight]}>
              <Text style={styles.title}>
                Current Location: {data.currentLocation}
              </Text>
              <Text style={styles.title}>
                Highest Qualification: {data.education}
              </Text>
              <Text style={styles.title}>Last Job Title: {data.jobTitle}</Text>
            </View>
          </View>

          <View style={styles.line}></View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <Text>{data.profile}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experiences</Text>
            {data.companiesDetails.map((company) => {
              return (
                <View style={styles.companySection}>
                  <View style={styles.companyTitleSection}>
                    <Text>
                      {company.name}, {company.jobTitle}
                    </Text>
                  </View>
                  <Text>
                    {company.startDate} - {company.endDate} (
                    {`${parseFloat(company.noOfYears).toFixed(1)} years`})
                  </Text>
                  <View style={{ marginTop: "8px", marginBottom: "4px" }}>
                    {company.responsibilities.map((responsibility) => {
                      return (
                        <View style={{ flexDirection: "row", marginBottom: 7 }}>
                          <Text style={{ marginHorizontal: 8 }}>•</Text>
                          <Text>{responsibility}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>

          <View style={[styles.section,{marginTop: "0px"}]}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.educationDetails.map((education) => {
              return (
                <View style={styles.educationSection}>
                  <View style={styles.companyTitleSection}>
                    <Text>
                      {education.name}, {education.qualification}
                    </Text>
                  </View>
                  <Text>
                    {education.startDate} - {education.endDate} (
                    {`${parseFloat(education.noOfYears).toFixed(1)} years`})
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={[styles.section, { marginTop: "0px" }]}>
            <Text style={styles.sectionTitle}>Spoken Languages</Text>
            {data.spokenLanguages.map((Language) => {
              return (
                <View style={{ flexDirection: "row", marginBottom: 4 }}>
                  <Text style={{ marginHorizontal: 8 }}>•</Text>
                  <Text>{Language}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Primary Skills</Text>
            {data.primarySkills.map((skill) => {
              return (
                <View style={{ flexDirection: "row", marginBottom: 4 }}>
                  <Text style={{ marginHorizontal: 8 }}>•</Text>
                  <Text>{skill}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Secondary Skills</Text>
            {data.secondarySkills.map((skill) => {
              return (
                <View style={{ flexDirection: "row", marginBottom: 4 }}>
                  <Text style={{ marginHorizontal: 8 }}>•</Text>
                  <Text>{skill}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
  if (view) {
    return <PDFViewer style={styles.viewer}>{doc}</PDFViewer>;
  }

  // console.log(data);
  return doc;
};

export default PDFDocument;
