import React, { ReactNode, useState } from "react";
import { BiErrorCircle } from "react-icons/bi";

export const Collapse = ({
  title,
  children,
  isNoData,
}: {
  title: string;
  children: ReactNode;

  isNoData: boolean;
}) => {
  return (
    <div
      className="collapse-container"
      style={{ width: "100%", height: isNoData ? "500px" : "auto" }}
    >
      <div className="collapse-header">
        <div>{title}</div>
      </div>
      <div className="collapse-content">
        {isNoData ? (
          <div className="no-data">
            <BiErrorCircle size={50} />
            <p>No data found.</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
