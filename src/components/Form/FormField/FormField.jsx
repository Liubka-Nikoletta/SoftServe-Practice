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
  options,
  name,
  checked,
  min,
  max,
  step,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const renderInput = () => {
    if (type === "select") {
      return (
        <select
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={isDisabled}
          className={`form-field__input ${errorMessage ? "error" : ""}`}
          name={name}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options &&
            options.map((option) => (
              <option
                key={option.value || option}
                value={option.value || option}
              >
                {option.label || option}
              </option>
            ))}
        </select>
      );
    }
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={isDisabled}
        className={`form-field__input ${errorMessage ? "error" : ""}`}
        name={name}
        checked={type === "checkbox" ? checked : undefined}
        min={min}
        max={max}
        step={step}
      />
    );
  };

  return (
    <div className={`form-field ${isFocused ? "focused" : ""}`}>
      <label className="form-field__label">
        {label}
        {isRequired && <span className="form-field__required">*</span>}
      </label>
      {renderInput()}
      {errorMessage && (
        <span className="form-field__error">{errorMessage}</span>
      )}
    </div>
  );
};

export default FormField;
