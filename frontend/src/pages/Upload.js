import React, { useState, useContext, useRef, useEffect } from "react";
import "./css/Upload.css";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { toast } from "react-toastify";
import { resumeAPI } from "../api/resumeAPI";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { BsFillCloudUploadFill } from "react-icons/bs";
import { IoIosCloudDone } from "react-icons/io";
import { MdUploadFile } from "react-icons/md";
import ClipLoader from "react-spinners/ClipLoader";
import { userAPI } from "../api/userAPI";
import Modal from "../components/shared/Modal";
import { TiTick } from "react-icons/ti";
import { MdCancel } from "react-icons/md";
import { authenticationAPI } from "../api/authenticationAPI";
import { CSSTransition } from "react-transition-group";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isFilenameValid, setIsFilenameValid] = useState({
    focus: false,
    blur: false,
    valid: false,
  });
  const [userDetails, setUserDetails] = useState({});
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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
    if (e.target.value.length > 0) {
      setIsFilenameValid({ ...isFilenameValid, valid: true });
    } else {
      setIsFilenameValid({ ...isFilenameValid, valid: false });
    }
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
    if (userDetails.role === "ROLE_FREE" && userDetails.resumeLimit >= 5) {
      setShowUpgradeModal(true);
      return;
    }
    setIsLoading(true);
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

    resumeAPI
      .uploadResume2(formData)
      .then((res) => {
        toast.success("File uploaded successfully.");
        setIsLoading(false);
        navigate(`/users/${ctx.getUserId()}/resumes/${+res.data.id}`);
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again.");
        setIsLoading(false);
      });
  };

  function getUserDetails() {
    userAPI
      .getUserDetails(ctx.getUserId())
      .then((res) => {
        console.log(res.data);
        setUserDetails(res.data);
      })
      .catch((err) => {
        toast.error(
          err.response.data.message ||
            "Error in registration. Please try again." ||
            "Something went wrong. Please try again."
        );
      });
  }

  useEffect(() => {
    getUserDetails();
  }, [ctx.userDetails.role]);

  const handleSubscriptionUpgrade = () => {
    console.log("upgrade");
    userAPI
      .updateUserToPaid(ctx.getUserId())
      .then((res) => {
        authenticationAPI.changeRole("ROLE_PAID");
        ctx.handleUserRole();
        toast.success("Successfully upgraded to paid subscription");
        getUserDetails();
        setShowUpgradeModal(false);
      })
      .catch((err) => {
        toast.error("Error upgrading to paid subscription");
      });
  };

  return (
    <>
      {/* // Upgrade Subcription */}
      <CSSTransition
        in={showUpgradeModal}
        timeout={200}
        classNames="fadedown" // Classes for css transition in index.css
        unmountOnExit
      >
        <Modal
          isOpen={showUpgradeModal}
          closeModal={() => setShowUpgradeModal(false)}
        >
          <MdCancel
            className="cancel-icon"
            onClick={() => setShowUpgradeModal(false)}
          />
          <div className="subscription-container">
            <h2>Upgrade Subcription</h2>
            <p className="subscription-type">Paid</p>
            <p className="subscription-price">$20.00 per month</p>
            <div>
              <div className="d-flex align-items-center">
                <TiTick className="tick-icon" />
                <p>Unlimited resume upload</p>
              </div>
              <div className="d-flex align-items-center">
                <TiTick className="tick-icon" />
                <p>Unlimited resume parsing</p>
              </div>
            </div>
            <button
              onClick={handleSubscriptionUpgrade}
              className="btn-rounded-solid mt-4"
            >
              Upgrade
            </button>
          </div>
        </Modal>
      </CSSTransition>
      <div className="upload-container">
        <div className="upload-left-section">
          <form onSubmit={handleSubmit}>
            <h1>
              Upload a Resume <MdUploadFile className="upload-header-icon" />
            </h1>
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
              onBlur={() =>
                setIsFilenameValid({ ...isFilenameValid, blur: true })
              }
              onFocus={() =>
                setIsFilenameValid({ ...isFilenameValid, focus: true })
              }
              required
              className="form-control mb-3"
              placeHolder="Input resume name"
            />
            {!isFilenameValid.valid && isFilenameValid.focus && (
              <div className="alert alert-danger">
                Please input a resume filename
              </div>
            )}
            <div className="text-center">
              <button
                className="btn btn-warning btn-lg btn-block"
                disabled={!isValidAttachment || !isFilenameValid.valid}
                type="submit"
              >
                {isLoading ? (
                  <ClipLoader color="#007BFF" />
                ) : (
                  <span>Upload</span>
                )}
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
    </>
  );
};

export default Upload;
