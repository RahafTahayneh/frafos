import React from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  type: "info" | "error" | "warning";
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ type, title, onClose, children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="header">
          <div className="title">{title}</div>

          <IoClose
            className="close"
            onClick={onClose}
            size={20}
            color={"#303a42"}
          />
        </div>

        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
