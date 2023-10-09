import React, { useState } from "react";
import { PiExport } from "react-icons/pi"; // Import the required icons
import { BsShare } from "react-icons/bs";
import { MdKeyboardArrowDown } from "react-icons/md";
import Modal from "../Modal";

const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <div className="navbar">
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

      {isModalOpen && (
        <Modal type="info" title={"Coming Soon!"} onClose={toggleModal}>
          This feature will come soon!
        </Modal>
      )}
    </div>
  );
};

export default Navbar;
