import React from "react";
import { FaRedo } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import Dropdown from "../Dropdown";

const Toolbar = () => {
  return (
    <div className="control-panel">
      <Dropdown
        label="Date Range"
        options={["Today", "Last Week", "Last Day", "Custom"]}
      />
      <div className="icon-wrapper">
        <IoFilter size={15} />
      </div>
      <div className="icon-wrapper">
        <FaRedo size={12} />
      </div>
    </div>
  );
};

export default Toolbar;
