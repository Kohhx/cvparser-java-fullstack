import React, { useState } from 'react';
import './css/Upload.css';
import { DocViewer } from 'react-doc-viewer';



const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [docs, setDocs] = useState([]);
  const [activeDocument, setActiveDocument] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.name.split(".").pop().toLowerCase();
      if (fileType === "pdf" || fileType === "doc" || fileType === "docx") {
        setSelectedFile(file);
        setFilePreview(URL.createObjectURL(file));
        setDocs([{uri: URL.createObjectURL(file), fileType: fileType}]);
        setActiveDocument({uri: URL.createObjectURL(file), fileType: fileType});
      } else {
        alert("Only PDF, DOC, and DOCX file types are allowed.");
      }
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }
    
    console.log(`Uploading file: ${selectedFile.name}`);
    // Here, you could add code to upload the file to a server
  }
  

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
        { filePreview && 
          <DocViewer
            documents={docs}
            activeDocument={activeDocument}
            />
        }
      </div>
    </div>
  );
}

export default Upload;
