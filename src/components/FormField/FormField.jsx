import "./FormField.css";
import { useState } from "react";

const FormField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  errorMessage,
  isRequired = false,
  isDisabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`form-field ${isFocused ? "focused" : ""}`}>
      <label className="form-field__label">
        {label}
        {isRequired && <span className="form-field__required">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={isDisabled}
        className={`form-field__input ${errorMessage ? "error" : ""}`}
      />
      {errorMessage && (
        <span className="form-field__error">{errorMessage}</span>
      )}
    </div>
  );
};

export default FormField;
