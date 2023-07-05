import React, { useState, useContext, useRef, useEffect } from "react";
import "./css/UploadMulti.css";
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
import { BsFillArrowLeftSquareFill } from "react-icons/bs";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";

const UploadMulti = () => {
  const uploadFileRef = useRef(null);
  const uploadRef = useRef();
  const ctx = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isValidAttachment, setIsValidAttachment] = useState(false);
  // const [fileUrl, setFileUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragFileAttached, setDragFileAttached] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilenameValid, setIsFilenameValid] = useState({
    focus: false,
    blur: false,
    valid: false,
  });
  const [userDetails, setUserDetails] = useState({});
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [totalUploadCount, setTotalUploadCount] = useState(0);
  const [currentUploadCount, setCurrentUploadCount] = useState(0);
  const [fileObjects, setFileObjects] = useState([]);

  const deleteFile = (index) => {
    setFileObjects(fileObjects.filter((file, i) => i !== index));
    setCurrentUploadCount(0);
  };

  const setFileObj = (files) => {
    const fileObjStore = [];
    for (let i = 0; i < files.length; i++) {
      const newFileObj = {
        name: files[i].name,
        file: files[i],
        nameNoExt: files[i].name.split(".").slice(0, -1).join("."),
      };
      fileObjStore.push(newFileObj);
    }
    setFileObjects(fileObjStore);
  };

  const setFileUrlFunc = (index, type, files = null) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFileUrl(reader.result);
    };
    if (type === 2) {
      reader.readAsDataURL(fileObjects[index].file);
    } else {
      reader.readAsDataURL(files[0]);
    }
  };

  useEffect(() => {
    if (fileObjects.length > 0) {
      setTotalUploadCount(fileObjects.length);
      setFileUrlFunc(0, 2);
    }
  }, [fileObjects]);

  const nextCount = () => {
    if (currentUploadCount < totalUploadCount) {
      setCurrentUploadCount((prev) => prev + 1);
      setFileUrlFunc(currentUploadCount + 1, 2);
    }
  };

  const prevCount = () => {
    if (currentUploadCount > 0) {
      setCurrentUploadCount((prev) => prev - 1);
      setFileUrlFunc(currentUploadCount - 1, 2);
    }
  };

  const checkFileExtension = (file) => {
    // Check if file extension is correct
    const fileType = file.name.split(".").pop().toLowerCase();
    // console.log(fileType)
    if (fileType !== "pdf" && fileType !== "doc" && fileType !== "docx") {
      toast.error("Only PDF, DOC, and DOCX file types are allowed.");
      return false;
    }
    return true;
  };

  const handleFileChange = (event) => {
    setCurrentUploadCount(0);
    setTotalUploadCount(0);
    setFileObjects([]);
    setIsValidAttachment(false);

    const files = event.target.files;
    // check if file exist
    if (files.length === 0) {
      // toast.error("Please select a file before uploading.");
      return;
    }

    // Check all files extension
    for (let i = 0; i < files.length; i++) {
      if (!checkFileExtension(files[i])) return;
    }


    setIsValidAttachment(true);
    setTotalUploadCount(files.length);

    // Set file object
    setFileObj(files);

    // PDF
    if (files) {
      setFileUrlFunc(0, 1, files);
    }
  };

  console.log(fileObjects);
  // console.log(fileUrl)

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
    setCurrentUploadCount(0);
    setTotalUploadCount(0);
    setFileObjects([]);
    setIsValidAttachment(false);
    setIsDragOver(false);

    const { files } = event.dataTransfer;

    if (files.length === 0) {
      // toast.error("Please select a file before uploading.");
      return;
    }

    // Check all files extension
    for (let i = 0; i < files.length; i++) {
      if (!checkFileExtension(files[i])) return;
    }

    setIsValidAttachment(true);
    setTotalUploadCount(files.length);

    // Set file object
    setFileObj(files);

    // PDF
    if (files) {
      setFileUrlFunc(0, 1, files);
    }
  };

  const createResume = async (formData, i) => {
    return resumeAPI.uploadResume2(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userDetails.role === "ROLE_FREE" && userDetails.resumeLimit >= 5) {
      setShowUpgradeModal(true);
      return;
    }
    setIsLoading(true);
    if (fileObjects.length === 0) {
      toast.error("Please select a file before uploading.");
      return;
    }

    for (let i = 0; i < fileObjects.length; i++) {
      const formData = new FormData();
      formData.append("file", fileObjects[i].file);
      formData.append("fileName", fileObjects[i].nameNoExt);
      try {
        await createResume(formData, i + 1);
        toast.success(`${i + 1} File uploaded successfully.`);
      } catch (err) {
        toast.error("Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }
    }
    setIsLoading(false);
    navigate(`/users/${ctx.getUserId()}/resumes`);
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
                <p>Unlimited resume upload and parsing</p>
              </div>
              <div className="d-flex align-items-center">
                <TiTick className="tick-icon" />
                <p>Export to excel function</p>
              </div>
              <div className="d-flex align-items-center">
                <TiTick className="tick-icon" />
                <p>Multiple resumes upload function</p>
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
              Upload Multiple Resumes
              <MdUploadFile className="upload-header-icon" />
            </h1>
            <div
              className={`drop-outer-border ${isDragOver && "drag-over"} mb-3`}
              ref={uploadRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={() => setIsDragOver(false)}
            >
              <div className="drop-inner-border-2 text-center">
                {dragFileAttached || isValidAttachment ? (
                  <IoIosCloudDone className="upload-icon-success" />
                ) : (
                  <BsFillCloudUploadFill className="upload-icon" />
                )}

                {!dragFileAttached ? (
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="border dotted mt-3"
                    hidden
                    ref={uploadFileRef}
                  />
                ) : (
                  <h4>File attached successfully</h4>
                )}
                <div>
                  <button
                    type="button"
                    onClick={() => uploadFileRef.current.click()}
                    className="btn btn-secondary input-file-btn"
                  >
                    Upload Resumes
                  </button>
                  <br />
                  {totalUploadCount > 0 && `${totalUploadCount} files attached`}
                </div>
              </div>
            </div>
            {fileObjects.length > 0 && (
              <div className="file-display">
                {fileObjects.map((fileobj, index) => {
                  return (
                    <div>
                      <span>
                        {index + 1}) {fileobj.name}
                      </span>
                      <AiFillDelete
                        onClick={() => deleteFile(index)}
                        className="delete-icon"
                      />
                    </div>
                  );
                })}
              </div>
            )}
            <div className="text-center">
              <button
                className="btn btn-warning btn-lg btn-block"
                disabled={!isValidAttachment || isLoading}
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
            {fileObjects.length > 0 && (
              <div className="d-flex justify-content-center gap-5 arrows">
                {currentUploadCount < 1 ? (
                  <BsFillArrowLeftSquareFill className="arrow-disabled" />
                ) : (
                  <BsFillArrowLeftSquareFill
                    onClick={prevCount}
                    className="arrow-icon"
                  />
                )}
                <div className="count"> {currentUploadCount + 1}</div>
                {currentUploadCount === totalUploadCount - 1 ? (
                  <BsFillArrowRightSquareFill className="arrow-disabled" />
                ) : (
                  <BsFillArrowRightSquareFill
                    onClick={nextCount}
                    className="arrow-icon"
                  />
                )}
              </div>
            )}
            {fileObjects.length > 0 && (
              <object
                data={fileUrl}
                type="application/pdf"
                width="100%"
                height="92%"
              ></object>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadMulti;
