import React, { useState, useContext, useRef } from "react";
import "./css/Upload.css";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { toast } from "react-toastify";
import { resumeAPI } from "../api/resumeAPI";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { BsFillCloudUploadFill } from "react-icons/bs";
import { IoIosCloudDone } from "react-icons/io";
import { MdUploadFile } from "react-icons/md";


const Upload = () => {
  const uploadRef = useRef();
  const ctx = useContext(UserContext);
  const navigate = useNavigate();
  console.log(DocViewer);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isValidAttachment, setIsValidAttachment] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragFileAttached, setDragFileAttached] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

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

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", event.target.id);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const { files } = event.dataTransfer;
    // console.log(files);
    // if (files.length > 0) {
    //   // setFiles([...files]);
    // }

    if (files.length === 0) {
      toast.error("Please select a file before uploading.");
      return;
    }

    const file = files[0];
    // Check if file extension is correct
    const fileType = file.name.split(".").pop().toLowerCase();
    // console.log(fileType)
    if (fileType !== "pdf" && fileType !== "doc" && fileType !== "docx") {
      toast.error("Only PDF, DOC, and DOCX file types are allowed.");
      return;
    }
    // Set file to state
    console.log(selectedFile);
    setSelectedFile(file);
    setIsValidAttachment(true);
    setDragFileAttached(true);

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
      <div className="upload-left-section">
        <form onSubmit={handleSubmit}>
          <h1>Upload a Resume <MdUploadFile className="upload-header-icon" /></h1>
          <div
            className={`drop-outer-border ${isDragOver && "drag-over"} mb-3`}
            ref={uploadRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDragOver(false)}
          >
            <div className="drop-inner-border text-center">
              {dragFileAttached || isValidAttachment ? (
                <IoIosCloudDone className="upload-icon-success" />
              ) : (
                <BsFillCloudUploadFill className="upload-icon" />
              )}

              {!dragFileAttached ? (
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="border dotted mt-3"
                />
              ) : (
                <h4>File attached successfully</h4>
              )}
            </div>
          </div>
          <input
            type="text"
            onChange={handleFileName}
            required
            className="form-control mb-3"
            placeHolder="Input resume name"
          />
          <div className="text-center">
            <button
              className="btn btn-warning btn-lg"
              disabled={!isValidAttachment}
              type="submit"
            >
              Upload
            </button>
          </div>
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
{/*
            {fileUrl && (
              <object
                data={fileUrl}
                type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                width="100%"
                height="100%"
              ></object>
            )} */}
        </div>
      </div>
    </div>
  );
};

export default Upload;
