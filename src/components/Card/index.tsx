import React from "react";

interface CardProps {
  label: string;
  value: string;
  info?: string;
}

const Card: React.FC<CardProps> = ({ label, value, info }) => {
  return (
    <div className="card-wrapper">
      <div className="label">{label}</div>
      <div className="value">{value ?? 0}</div>
    </div>
  );
};

export default Card;
