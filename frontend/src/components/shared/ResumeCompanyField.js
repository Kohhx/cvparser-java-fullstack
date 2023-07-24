import React, { useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import "./ResumeCompanyField.css";
import { AiFillDelete } from "react-icons/ai";
import { RiAddCircleFill } from "react-icons/ri";

const monthTable = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "July",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

const ResumeCompanyField = ({ company, index, companiesDetailChange }) => {
  // Convert date format from  Nov 2023 to 2023-11
  const convertDateFormat = (date) => {
    const dateArray = date.split("/");
    const dateOut = dateArray[1] + "-" + dateArray[0];
    return dateOut;
  };

  // Convert date format from 2023`-11 to 11/2023
  const convertDateFormatForSave = (date) => {
    const dateArray2 = date.split("-");
    const dateOut2 = dateArray2[1] + "/" + dateArray2[0];
    return dateOut2;
  };

  const [editable, setEditable] = useState(false);
  const [addNew, setAddNew] = useState(1);

  const [companyDetail, setCompanyDetail] = useState({
    name: company.name,
    startDate: company.startDate,
    endDate: company.endDate,
    noOfYears: parseFloat(company.noOfYears).toFixed(1),
    jobTitle: company.jobTitle,
    responsibilities: company.responsibilities,
  });

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
    setCompanyDetail((prev) => ({ ...prev, noOfYears: Years }));
  };

  const handleEditResponsibility = (e, index) => {
    const value = e.target.value;
    const newResponsibilities = [...companyDetail.responsibilities];
    newResponsibilities[index] = value;
    setCompanyDetail((prev) => ({
      ...prev,
      responsibilities: newResponsibilities,
    }));
  };

  const deleteResponsibility = (index) => {
    const newResponsibilities = companyDetail.responsibilities.filter(
      (res, i) => i !== index
    );
    setCompanyDetail((prev) => ({
      ...prev,
      responsibilities: newResponsibilities,
    }));
  };

  const addResponsibility = () => {
    setCompanyDetail((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ""],
    }));
    setAddNew(addNew + 1);
  };


  useEffect(() => {
    // Replace 'targetElementId' with the ID of the element you want to scroll to.
    const id = `last-responsibility-${index}`;
    const targetElement = document.getElementById(id);
    console.log(targetElement)
    if (targetElement == null) return;

    // Scroll to the target element.
    targetElement.scrollIntoView({
      behavior: "smooth", // Optional: Add smooth scrolling animation.
    });

    targetElement.focus();
  }, [addNew]);

  useEffect(() => {
    console.log("Change CO", companyDetail)
    companiesDetailChange(companyDetail, index)
  },[companyDetail])

  console.log(companyDetail.responsibilities);

  return (
    <div className="companies-details-single">
      <div className="d-flex justify-content-between align-items-center">
        <p className="company-name">
          <span>{index + 1}) Company Name: </span>
          <input
            disabled={!editable}
            className="w-50 field-input"
            type="text"
            value={companyDetail.name}
            onChange={(e) =>
              setCompanyDetail((prev) => {
                return { ...prev, name: e.target.value };
              })
            }
          />
        </p>
        <AiFillEdit
          className="details-edit-icon"
          onClick={() => setEditable(!editable)}
        />
      </div>

      <div className="companies-details-card-details">
        {/* Designation */}
        <p className="d-flex gap-2 align-items-center">
          <span> Designation:</span>
          <input
            disabled={!editable}
            className="w-50 field-input my-1"
            type="text"
            value={companyDetail.jobTitle}
            onChange={(e) =>
              setCompanyDetail((prev) => {
                return { ...prev, jobTitle: e.target.value };
              })
            }
          />
        </p>

        {/* Start Date */}
        <p className="d-flex align-items-center gap-2">
          <span>Start Date:</span>
          <input
            className="w-50 my-1 date-input date-fit"
            disabled={!editable}
            type="month"
            onChange={(e) =>
              setCompanyDetail((prev) => {
                console.log(e.target.value);
                return { ...prev, startDate: e.target.value };
              })
            }
            value={companyDetail.startDate}
          />
        </p>

        {/* End Date */}
        <p className="d-flex align-items-center gap-2">
          <span>End Date:</span>
          <input
            className="w-50 my-1 date-input"
            disabled={!editable}
            type="month"
            onChange={(e) =>
              setCompanyDetail((prev) => {
                console.log(e.target.value);
                return { ...prev, endDate: e.target.value };
              })
            }
            value={companyDetail.endDate}
          />
        </p>

        {/* No of Years */}
        <p className="d-flex gap-2 align-items-center">
          <span> No of Years: </span>
          <input
            disabled={!editable}
            className="w-fit field-input my-1"
            type="number"
            step="0.1"
            value={companyDetail.noOfYears}
            onChange={(e) =>
              setCompanyDetail((prev) => {
                const value = parseFloat(e.target.value);
                return { ...prev, noOfYears: value.toFixed(1) };
              })
            }
          />
          {editable && (
            <button
              className="btn btn-secondary btn-sm btn-custom"
              onClick={() =>
                computeNoOfYears(companyDetail.startDate, companyDetail.endDate)
              }
            >
              Compute
            </button>
          )}
        </p>

        <div className="d-flex align-items-center gap-2">
          <p className="mt-2 text-decoration-underline mb-2">
            Responsibilities
          </p>
          {editable && (
            <RiAddCircleFill
              onClick={addResponsibility}
              className="cursor-pointer add-responsibility-icon"
            />
          )}
        </div>
        <ul className="px-5 list-container">
          {companyDetail.responsibilities.map((responsibility, i) => (
            <li className="d-flex align-items-center">
              <span class="bullet">&#8226;</span>
              {editable ? (
                <div className="extend d-flex gap-3">
                  <textarea
                    rows="2"
                    className="textarea-custom"
                    value={responsibility}
                    onChange={(e) => handleEditResponsibility(e, i)}
                    id={
                      i + 1 === companyDetail.responsibilities.length &&
                      `last-responsibility-${index}`
                    }
                  ></textarea>
                  <AiFillDelete onClick={() => deleteResponsibility(i)} />
                </div>
              ) : (
                <span>{responsibility}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResumeCompanyField;
