import React, { useState, useContext } from "react";
import "./css/Upload.css";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { toast } from "react-toastify";
import { resumeAPI } from "../api/resumeAPI";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Upload = () => {
  const ctx = useContext(UserContext);
  const navigate = useNavigate();
  console.log(DocViewer);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isValidAttachment, setIsValidAttachment] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (event) => {
    // setFileUrl("");
    // console.log(fileUrl);
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
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileUrl(reader.result);
        console.log(fileUrl);
      };
      setSelectedFile(file);
      reader.readAsDataURL(file);
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
      navigate(`/users/${ctx.getUserId()}/resumes/${+res.data.id}`);
    });
  };

  return (
    <div className="upload-container">
      hello
      <div className="upload-left-section">
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
      <div className="upload-right-section">
        <div className="viewer-container">
          {fileUrl && (
            <object
              data={fileUrl}
              type="application/pdf"
              width="100%"
              height="100%"
            ></object>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
