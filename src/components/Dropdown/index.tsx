import React, { useState } from "react";
import { BiCalendar } from "react-icons/bi";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface DropdownProps {
  options: string[];
  label: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="icon-wrapper dropdown-wrapper">
      <BiCalendar size={18} />
      <div className="selected-option" onClick={() => setIsOpen(!isOpen)}>
        <span>{label}</span>
        {isOpen ? (
          <MdKeyboardArrowUp size={18} />
        ) : (
          <MdKeyboardArrowDown size={18} />
        )}
      </div>

      {isOpen && (
        <ul className="dropdown">
          {options.map((option, index) => (
            <li key={index} onClick={() => setIsOpen(false)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
