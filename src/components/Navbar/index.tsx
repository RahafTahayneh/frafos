import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="navbar">
      {/* This can be an avatar or a user icon */}
      <div className="user-profile">
        <div className="avatar" />
        <span className="username">Mark Duane</span>
      </div>
    </div>
  );
};

export default Navbar;
