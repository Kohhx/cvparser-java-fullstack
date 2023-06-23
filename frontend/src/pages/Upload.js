import React, { useState } from "react";
import "./css/Upload.css";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { toast } from "react-toastify";
import { resumeAPI } from "../api/resumeAPI";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();
// console.log(pdfjs.version)

const Upload = () => {
  console.log(DocViewer);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isValidAttachment, setIsValidAttachment] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (event) => {
    setFileUrl("");
    console.log(fileUrl);
    const file = event.target.files[0];
    // check if file exist
    if (!file) {
      toast.error("Please select a file before uploading.");
      return;
    }
    // Check if file extension is correct
    const fileType = file.name.split(".").pop().toLowerCase();
    // console.log(fileType)
    if (fileType !== "pdf" && fileType !== "doc" && fileType !== "docx") {
      toast.error("Only PDF, DOC, and DOCX file types are allowed.");
    }
    // Set file to state
    console.log(selectedFile);
    setSelectedFile(file);
    setIsValidAttachment(true);

    // PDF
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileUrl(reader.result);
        console.log(fileUrl);
      };
      setSelectedFile(selectedFile);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleFileName = (e) => {
    setFileName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file before uploading.");
      return;
    }
    if (!fileName) {
      toast.error("Please enter a filename before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("fileName", fileName);

    console.log(formData.get("filename"));

    resumeAPI.uploadResume(formData).then((res) => {
      toast.success("File uploaded, navigate to list page.");
    });
  };

  return (
    <div className="container-origin">
      <div className="left-side">
        <form onSubmit={handleSubmit}>
          <table className="upload-table">
            <tbody>
              <tr>
                <td>
                  <label>Select a file:</label>
                </td>
                <td>
                  <input type="file" onChange={handleFileChange} required />
                </td>
              </tr>
              {selectedFile && (
                <tr>
                  <td>
                    <label>Input filename:</label>
                  </td>
                  <td>
                    <input type="text" onChange={handleFileName} required />
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="2">
                  <button disabled={!isValidAttachment} type="submit">
                    Upload
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
      <div className="right-side">
        {fileUrl && (
          <object
            data={fileUrl}
            type="application/pdf"
            width="100%"
            height="100%"
          ></object>
        )}
        {/* <iframe src={fileUrl} title="Document Preview" width="100%" height="500px" /> */}
        {/* { fileUrl &&
          <DocViewer pluginRenderers={DocViewerRenderers} documents={docs} />
} */}
      </div>
    </div>
  );
};

export default Upload;
