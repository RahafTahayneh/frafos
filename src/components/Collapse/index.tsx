import React, { ReactNode, useState } from "react";
import { FaChevronDown } from "react-icons/fa"; // Import the arrow icon

export const Wrapper = ({
  title,
  children,
  defaultCollapsed = true,
}: {
  title: string;
  children: ReactNode;

  defaultCollapsed: boolean;
}) => {
  const [collapse, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className="collapse-container">
      <div className="collapse-header" onClick={() => setCollapsed(!collapse)}>
        <div>{title}</div>
        <FaChevronDown
          className={`arrow-icon ${collapse ? "collapsed" : ""}`}
        />
      </div>
      <div className={`collapse-content ${collapse ? "collapsed" : ""}`}>
        {children}
      </div>
    </div>
  );
};
