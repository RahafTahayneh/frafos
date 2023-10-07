import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";
import { GiMicroscope } from "react-icons/gi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="logo-container">
        <div className="sidebar-logo" />
        <span className="logo-text">FRAFOS</span>
      </div>

      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "sidebar-item active-route" : "sidebar-item"
        }
      >
        <FaHome size={20} />
        <span className="sidebar-text">Home</span>
      </NavLink>
      <NavLink
        to="/calls"
        className={({ isActive }) =>
          isActive ? "sidebar-item active-route" : "sidebar-item"
        }
      >
        <IoCallOutline size={20} />
        <span className="sidebar-text">Calls</span>
      </NavLink>
      <NavLink
        to="/analytics"
        className={({ isActive }) =>
          isActive ? "sidebar-item active-route" : "sidebar-item"
        }
      >
        <GiMicroscope size={20} />
        <span className="sidebar-text">Analytics</span>
      </NavLink>

      <div className="logout-section">
        <button className="logout-button">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      <div className="toggle-icon" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? <FaAngleRight size={20} /> : <FaAngleLeft size={20} />}
      </div>
    </div>
  );
};

export default Sidebar;
