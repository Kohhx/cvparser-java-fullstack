import React, { useState } from 'react';
import "./css/ModalError.css";
import { CgCloseR } from "react-icons/cg";
function ModalError({ isOpen, onClose, errorMsg }) {
    return (
      <div
        className={`modal ${isOpen ? 'show' : ''}`} 
        tabIndex="-1"
        style={{ display: isOpen ? 'block' : 'none',
        fontFamily: "'Varela Round', sans-serif" }}
      >
        <div className="modal-dialog modal-confirm">
          <div className="modal-content">
            <div className="modal-header justify-content-center">
              <div className="icon-box">
                <i className="material-icons">&#xE5CD;</i>
              </div>
              {/* <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-hidden="true"
                onClick={onClose}
              >
               &times;
              </button> */}
              <CgCloseR onClick={onClose} className="close-icon" />
            </div>
            <div className="modal-body text-center">
              <h4>Ooops!</h4>
              <p>{errorMsg}</p>
              <button className="btn btn-success" data-dismiss="modal" onClick={onClose}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default ModalError;
