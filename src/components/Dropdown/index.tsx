import React, { useState } from "react";
import { BiCalendar } from "react-icons/bi";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface DropdownProps {
  options: string[];
  label: string;
  onSelect?: (selectedOption: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, label, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOptionClick = (option: string) => {
    onSelect?.(option);
    setIsOpen(false);
  };

  return (
    <div
      className="icon-wrapper dropdown-wrapper"
      onClick={() => setIsOpen(!isOpen)}
    >
      <BiCalendar size={18} />
      <div className="selected-option">
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
            <li key={index} onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
