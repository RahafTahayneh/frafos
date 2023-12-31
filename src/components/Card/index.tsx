import React from "react";

interface CardProps {
  /**
   * What Card label
   */
  label: string;
  /**
   * What Card Value
   */
  value: string;
}

const Card: React.FC<CardProps> = ({ label, value }) => {
  return (
    <div className="card-wrapper">
      <div className="label">{label}</div>
      <div className="value">{value ?? 0}</div>
    </div>
  );
};

export default Card;
