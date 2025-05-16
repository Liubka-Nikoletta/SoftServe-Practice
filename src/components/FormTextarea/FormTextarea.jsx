import "./FormTextarea.css";

const FormTextarea = ({
  label,
  value,
  onChange,
  placeholder,
  errorMessage,
  isRequired = false,
  isDisabled = false,
}) => {
  return (
    <div className={`form-field`}>
      <label className="form-field__label">
        {label}
        <span className={isRequired ? "form-field__required" : ""}>*</span>
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-field__textarea ${errorMessage ? "error" : ""}`}
        disabled={isDisabled}
        isRequired={isRequired}
      />
      {errorMessage && (
        <span className="form-field__error">{errorMessage}</span>
      )}
    </div>
  );
};

export default FormTextarea;
