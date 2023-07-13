import React from "react";
import { RiAddCircleFill } from "react-icons/ri";

const ResumeFieldInput = ({ data, setData, setDatas }) => {
  return (
    <div>
      {data.isEditing && (
        <div className="d-flex gap-2 align-items-center">
          <input
            type="text"
            value={data.value}
            onChange={(e) =>
              setData((prev) => ({ ...prev, value: e.target.value }))
            }
            disabled={!data.isEditing}
            placeholder="Add a skill"
            className="mt-1 mb-1"
          />
          <RiAddCircleFill
            className="edit-icons-md"
            onClick={() => {
              setData((prev) => ({ ...prev, value: "" }));
              setDatas((prev) => [...prev, data.value]);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ResumeFieldInput;
