import React, { useState } from "react";
import { PiExport } from "react-icons/pi";
import { BsShare } from "react-icons/bs";
import { MdKeyboardArrowDown } from "react-icons/md";
import { AiOutlineMenu } from "react-icons/ai";
import logo from "./logo.png";
import Modal from "../Modal";
import Sidebar from "../Sidebar";

const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <div className="navbar">
      <div
        className="logo-container"
        onClick={() => setToggleSidebar(!toggleSidebar)}
      >
        <AiOutlineMenu
          onClick={() => setToggleSidebar(!toggleSidebar)}
          size={20}
          style={{
            marginRight: "14px",
            marginLeft: "4px",
            color: "#72828f",
            cursor: "pointer",
          }}
        />
        <img src={logo} className="img" alt={"logo"} />
      </div>
      <div className="widgets">
        <div onClick={toggleModal}>
          <BsShare
            size={18}
            style={{ marginRight: "14px", color: "#72828f", cursor: "pointer" }}
          />
        </div>

        <div onClick={toggleModal}>
          <PiExport
            size={20}
            style={{ marginRight: "24px", color: "#72828f", cursor: "pointer" }}
          />
        </div>

        <div className="user-profile">
          <div className="avatar" />
          <span className="username">
            Mark Divan
            <MdKeyboardArrowDown
              size={14}
              style={{ marginLeft: "4px", color: "#72828f" }}
            />
          </span>
        </div>
      </div>

      {isModalOpen && (
        <Modal type="info" title={"Coming Soon!"} onClose={toggleModal}>
          This feature will come soon!
        </Modal>
      )}
      {toggleSidebar && <Sidebar />}
    </div>
  );
};

export default Navbar;
