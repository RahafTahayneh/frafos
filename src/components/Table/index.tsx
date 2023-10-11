// index.tsx

import React from "react";
import "./style.scss";
import { PiMagnifyingGlassPlusBold } from "react-icons/pi";
import { RiDeleteBinFill } from "react-icons/ri";
import { TbZoomCancel } from "react-icons/tb";

const dummyData = [
  { label: "Label 1", value: "Value 1", percentage: "50%" },
  { label: "Label 2", value: "Value 2", percentage: "30%" },
];

// This is just a demo TAble
const TableComponent = () => {
  return (
    <table className="custom-table">
      <thead>
        <tr>
          <th>Label</th>
          <th>Value</th>
          <th>Percentage</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {dummyData.map((row, index) => (
          <tr key={index}>
            <td>{row.label}</td>
            <td>{row.value}</td>
            <td className="percentage">{row.percentage}</td>
            <td>
              <PiMagnifyingGlassPlusBold size={16} style={{ marginRight: 8 }} />
              <RiDeleteBinFill
                size={16}
                color="red"
                style={{ marginRight: 8 }}
              />
              <TbZoomCancel size={17} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
