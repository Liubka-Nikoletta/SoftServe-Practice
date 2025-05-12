import { useState, useEffect } from "react"; // Додано useEffect
import FormField from "../../../../FormField/FormField";
import FormSubmit from "../../../../FormSubmit/FormSubmit";
import Button from "../../../../Button/Button";
import "./SessionForm.css";

const SessionForm = ({ onClose, onSubmit, mode, initialData }) => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setDay(String(initialData.day || ""));
      setMonth(initialData.month || "");
      setTime(initialData.originalTime || "");
    } else {
      setDay("");
      setMonth("");
      setTime("");
    }
    setErrors({});
  }, [mode, initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!day.trim()) newErrors.day = "Day is required";
    else if (isNaN(day) || parseInt(day) < 1 || parseInt(day) > 31) {
      newErrors.day = "Invalid day";
    }
    if (!month.trim()) newErrors.month = "Month is required";
    if (!time.trim()) newErrors.time = "Time is required";
    else if (!/^\d{2}:\d{2}$/.test(time)) {
      newErrors.time = "Invalid time format (HH:MM)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ day, month, time });
    }
  };

  return (
    <div className="session-form-backdrop" onClick={onClose}>
      <div className="session-form" onClick={(e) => e.stopPropagation()}>
        <div className="session-form__header">
          <h2 className="session-form__title">
            {mode === "add" ? "Add New" : "Edit"} Session
          </h2>
          <Button icon="fa-close" size="small" onClick={onClose} />
        </div>
        <form onSubmit={handleSubmit} className="session-form__form">
          <FormField
            label="Day"
            type="number"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            placeholder="e.g., 27"
            errorMessage={errors.day}
            isRequired
            isDisabled={mode === "edit"}
          />
          <FormField
            label="Month"
            type="text"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="e.g., April"
            errorMessage={errors.month}
            isRequired
            isDisabled={mode === "edit"}
          />
          <FormField
            label="Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g., 14:30"
            errorMessage={errors.time}
            isRequired
          />
          <FormSubmit isDisabled={false} />
        </form>
      </div>
    </div>
  );
};

export default SessionForm;
