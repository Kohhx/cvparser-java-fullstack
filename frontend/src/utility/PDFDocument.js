import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    display: "block",
  },
  title: {
    textAlign: "center",
  },
  box:{
    width: 100,
    height: 100,
    backgroundColor: 'red',
  }
  // text: {
  //   fontSize: 14,
  //   fontFamily: 'sans-serif',
  //   fontWeight: 'normal',
  //   color: '#000',
  // },
});


const PDFDocument = ({data}) => {

  console.log(data)
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* <View style={styles.box}></View> */}
        <Text style={styles.title}>{data.filename}</Text>
        <Text style={styles.title}>{data.name}</Text>
        <View style={styles.section}>
          <Text>Section #1</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;
