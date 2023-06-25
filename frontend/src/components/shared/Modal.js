import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

const Modal = ({ children, isOpen, closeModal }) => {
  // This is prevent content behind of overlay from moving when modal is displayed
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  const modalContent = (
    <div className="modal-container">
      <div className="modal-backdrop" onClick={closeModal}></div>
      <div className="modal-content">{children}</div>
    </div>
  );

  const modelDisplay =
    isOpen &&
    ReactDOM.createPortal(modalContent, document.getElementById("modal"));

  return modelDisplay;
};

export default Modal;
