import "./FormSubmit.css";

const FormSubmit = ({ isDisabled }) => {
  return (
    <button type="submit" className="form-submit__button" disabled={isDisabled}>
      Submit
    </button>
  );
};

export default FormSubmit;
