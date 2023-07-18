import React, { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import "./DotMenu.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { fileUtil } from "../utility/fileUtil";
import PDFDocument from "../utility/PDFDocument";

const DotMenu = ({ resume, excelDownload, pdfDownload }) => {
  const [dotMenu, setDotMenu] = useState(false);
  return (
    <div >
      <div
        className="dot-container"
        onClick={(e) => {
          e.stopPropagation();
          setDotMenu(!dotMenu);
        }}
      >
        <BsThreeDotsVertical className="dots-icon" />
        {dotMenu && (
          <div className="dot-menu" onMouseLeave={() => setDotMenu(false)} >
            <p onClick={() => excelDownload(resume)} className="border-b">
              Download Excel
            </p>
            <p
              onClick={() => fileUtil.firebaseFileDownload(resume.fileRef)}
              className="border-b"
            >
              Download Resume
            </p>
            {/* {resume && (
              <PDFDownloadLink
                className="pdf-download-link"
                document={<PDFDocument data={resume} />}
                fileName={resume.filename + ".pdf"}
              >
                {({ blob, url, loading, error }) =>
                  loading ? (
                    <p>Loading</p>
                  ) : (
                    <p className="pdf-p">Download Avensys Resume</p>
                  )
                }
              </PDFDownloadLink>
            )} */}
            <p>
              Download Avensys Resume
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DotMenu;
