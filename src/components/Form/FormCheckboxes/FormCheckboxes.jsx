import React from "react";
import "./FormCheckboxes.css";

const FormCheckboxes = ({
  checkboxes,
  selectedCheckboxes,
  onCheckboxChange,
  error,
  isRequired = false,
}) => {
  return (
    <div className="form-field">
      <label className="form-field__label">
        Genres
        {isRequired && <span className="form-field__required">*</span>}
      </label>
      <div className="genre-checkboxes__group">
        {checkboxes.map((checkbox) => (
          <label key={checkbox} className="genre-checkboxes__label">
            <input
              type="checkbox"
              value={checkbox}
              checked={selectedCheckboxes.includes(checkbox)}
              onChange={() => onCheckboxChange(checkbox)}
              className="genre-checkboxes__input"
            />{" "}
            {checkbox}
          </label>
        ))}
      </div>
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
};

export default FormCheckboxes;
