import React, { useState } from "react";
import "./css/Upload.css";
import DocViewer from "react-doc-viewer";
import { toast } from "react-toastify";
import { resumeAPI } from "../api/resumeAPI";

const Upload = () => {
  console.log(DocViewer);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [docs, setDocs] = useState([]);
  const [activeDocument, setActiveDocument] = useState(null);
  const [showFileInput, setShowFileInput] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      console.log(file);
      const fileType = file.name.split(".").pop().toLowerCase();
      if (fileType === "pdf" || fileType === "doc" || fileType === "docx") {
        setSelectedFile(file);
        setShowFileInput(true);
        // const fileReader = new FileReader();
        // fileReader.onload = () => {
        //   setFilePreview(fileReader.result);
        //   console.log(filePreview)
        // };
        // fileReader.readAsDataURL(file);

        // setFilePreview(URL.createObjectURL(file));
        // console.log(filePreview)
        // setDocs([{uri: URL.createObjectURL(file), fileType: fileType}]);
        // setActiveDocument({uri: URL.createObjectURL(file), fileType: fileType});
      } else {
        toast.error("Only PDF, DOC, and DOCX file types are allowed.");
      }
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
    })


  };

  return (
    <div className="container">
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
              {showFileInput && (
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
                  <button type="submit">Upload</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
      <div className="right-side">
        {/* { filePreview &&
          <DocViewer
            documents={docs}
            // activeDocument={activeDocument}
            />
        } */}
      </div>
    </div>
  );
};

export default Upload;
