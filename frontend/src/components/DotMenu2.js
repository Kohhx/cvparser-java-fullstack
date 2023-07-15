import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import "./DotMenu.css";

const DotMenu2 = ({ children }) => {
  const [dotMenu, setDotMenu] = useState(false);
  return (
    <div>
      <div
        className="dot-container"
        onClick={(e) => {
          e.stopPropagation();
          setDotMenu(!dotMenu);
        }}
      >
        <BsThreeDotsVertical className="dots-icon" />
        {dotMenu && children}
      </div>
    </div>
  );
};

export default DotMenu2;
