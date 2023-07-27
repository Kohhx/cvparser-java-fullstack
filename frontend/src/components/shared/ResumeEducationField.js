import React, { useState, useEffect, useRef } from "react";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { AiOutlineDown } from "react-icons/ai";
import { AiOutlineUp } from "react-icons/ai";

import "./ResumeEducationField.css";

const ResumeEducationField = ({
  education,
  index,
  educationDetailsChange,
  deleteEducation,
  switchContent,
}) => {
  const [editable, setEditable] = useState(false);

  const [educationDetail, setEducationDetail] = useState({
    name: education.name,
    startDate: education.startDate,
    endDate: education.endDate,
    noOfYears: parseFloat(education.noOfYears).toFixed(1),
    qualification: education.qualification,
  });

  // Set education detail state when education props changes
  useEffect(() => {
    if (education) {
      setEducationDetail({
        name: education.name,
        startDate: education.startDate,
        endDate: education.endDate,
        noOfYears: parseFloat(education.noOfYears).toFixed(1),
        qualification: education.qualification,
      });
    }
  }, [education]); // Add "company" as a dependency here

  const computeDuration = (startDate, endDate) => {
    if (startDate == null || endDate == null) {
      return 0;
    }
    // Parse the input dates as Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    //if start date is after end date return 0
    if (start > end) {
      return 0;
    }

    // Calculate the difference in years and months
    let yearsDiff = end.getFullYear() - start.getFullYear();
    let monthsDiff = end.getMonth() - start.getMonth();

    // Adjust for negative month difference (end date is earlier in the year than start date)
    if (monthsDiff < 0) {
      yearsDiff--;
      monthsDiff += 12;
    }

    // Return the result as an object
    // return {
    //   years: yearsDiff,
    //   months: monthsDiff,
    // };

    return (yearsDiff + monthsDiff / 12).toFixed(1);
  };

  const computeNoOfYears = (startDate, endDate) => {
    const Years = computeDuration(startDate, endDate);
    setEducationDetail((prev) => ({ ...prev, noOfYears: Years }));
  };

  // Store the previous companyDetail state using useRef
  const prevEducationDetailRef = useRef();
  useEffect(() => {
    // Check if the companyDetail state actually changed
    if (
      JSON.stringify(educationDetail) !==
      JSON.stringify(prevEducationDetailRef.current)
    ) {
      educationDetailsChange(educationDetail, index);
      prevEducationDetailRef.current = educationDetail;
    }
  }, [educationDetail, educationDetailsChange, index]);

  return (
    <div className="companies-details-single">
      <div className="d-flex justify-content-between align-items-center">
        <p className="company-name">
          <span>{index + 1}) Institution Name: </span>
          <input
            disabled={!editable}
            className="w-50 field-input"
            type="text"
            value={educationDetail.name}
            onChange={(e) =>
              setEducationDetail((prev) => {
                return { ...prev, name: e.target.value };
              })
            }
          />
        </p>
        <div className="d-flex gap-3">
          <AiFillEdit
            className="details-edit-icon"
            onClick={() => setEditable(!editable)}
          />
          <AiFillDelete
            className="details-edit-icon"
            onClick={() => deleteEducation(index)}
          />
          <AiOutlineUp
            className="details-edit-icon"
            onClick={() => switchContent(index, "UP")}
          />
          <AiOutlineDown
            className="details-edit-icon"
            onClick={() => switchContent(index, "DOWN")}
          />
        </div>
      </div>

      <div className="companies-details-card-details">
        {/* Designation */}
        <p className="d-flex gap-1 align-items-center">
          <span> Qualification:</span>
          <input
            disabled={!editable}
            className="w-75 field-input my-1"
            type="text"
            value={educationDetail.qualification}
            onChange={(e) =>
              setEducationDetail((prev) => {
                return { ...prev, qualification: e.target.value };
              })
            }
          />
        </p>

        {/* Start Date */}
        <p className="d-flex align-items-center gap-1">
          <span>Start Date:</span>
          <input
            className="w-50 my-1 date-input date-fit"
            disabled={!editable}
            type="month"
            onChange={(e) =>
              setEducationDetail((prev) => {
                console.log(e.target.value);
                return { ...prev, startDate: e.target.value };
              })
            }
            value={educationDetail.startDate}
          />
        </p>

        {/* End Date */}
        <p className="d-flex align-items-center gap-1">
          <span>End Date:</span>
          <input
            className="w-50 my-1 date-input"
            disabled={!editable}
            type="month"
            onChange={(e) =>
              setEducationDetail((prev) => {
                console.log(e.target.value);
                return { ...prev, endDate: e.target.value };
              })
            }
            value={educationDetail.endDate}
          />
        </p>

        {/* No of Years */}
        <p className="d-flex gap-1 align-items-center">
          <span> No of Years: </span>
          <input
            disabled={!editable}
            className="w-fit field-input my-1"
            type="number"
            step="0.1"
            value={educationDetail.noOfYears}
            onChange={(e) =>
              setEducationDetail((prev) => {
                const value = parseFloat(e.target.value);
                return { ...prev, noOfYears: value.toFixed(1) };
              })
            }
          />
          {editable && (
            <button
              className="btn btn-secondary btn-sm btn-custom"
              onClick={() =>
                computeNoOfYears(
                  educationDetail.startDate,
                  educationDetail.endDate
                )
              }
            >
              Compute
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default ResumeEducationField;
