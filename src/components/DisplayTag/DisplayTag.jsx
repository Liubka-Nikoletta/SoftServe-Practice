import React from "react";
import "./DisplayTag.css";

const DisplayTag = ({ children, className = "" }) => {
  return <div className={`display-tag ${className}`}>{children}</div>;
};

export default DisplayTag;
