import React, { ReactNode, useState } from "react";
import { IoMdArrowDropdownCircle } from "react-icons/io"; // Import the arrow icon

export const Collapse = ({
  title,
  children,
  defaultCollapsed = true,
}: {
  title: string;
  children: ReactNode;

  defaultCollapsed?: boolean;
}) => {
  const [collapse, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className="collapse-container">
      <div className="collapse-header" onClick={() => setCollapsed(!collapse)}>
        <div>{title}</div>
        <IoMdArrowDropdownCircle size={20} />
      </div>
      <div className={`collapse-content ${collapse ? "collapsed" : ""}`}>
        {children}
      </div>
    </div>
  );
};
