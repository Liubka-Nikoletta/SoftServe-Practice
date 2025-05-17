import { useState, useEffect } from "react";
import FormField from "../../../../Form/FormField/FormField";
import FormSubmit from "../../../../Form/FormSubmit/FormSubmit";
import Button from "../../../../Button/Button";
import "./SessionForm.css";

const ukrainianMonthsArray = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
];

const getMonthNumberFromName = (monthName) => {
  const index = ukrainianMonthsArray.findIndex(
    (m) => m.toLowerCase() === monthName.toLowerCase()
  );
  return index !== -1 ? index + 1 : null;
};

const getMonthNameFromStandardMonth = (monthOneBased) => {
  // monthOneBased це 1-12
  if (monthOneBased >= 1 && monthOneBased <= 12) {
    return ukrainianMonthsArray[monthOneBased - 1];
  }
  return "";
};

const SessionForm = ({ onClose, onSubmit, mode, initialData }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "edit" && initialData) {
      const day = initialData.day;
      const monthName = initialData.month;
      const initialTime = initialData.originalTime || "";

      if (day && monthName) {
        const monthNumber = getMonthNumberFromName(monthName);
        if (monthNumber) {
          const year = new Date().getFullYear();
          const formattedDate = `${year}-${String(monthNumber).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;
          setSelectedDate(formattedDate);
        } else {
          setSelectedDate("");
        }
      } else {
        setSelectedDate("");
      }
      setTime(initialTime);
    } else {
      setSelectedDate("");
      setTime("");
    }
    setErrors({});
  }, [mode, initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedDate.trim()) {
      newErrors.date = "Date is required";
    } else if (isNaN(new Date(selectedDate).getTime())) {
      newErrors.date = "Invalid date format";
    }

    if (!time.trim()) {
      newErrors.time = "Time is required";
    } else if (!/^\d{2}:\d{2}$/.test(time)) {
      newErrors.time = "Invalid time format. Use HH:MM";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const [year, monthStr, dayStr] = selectedDate.split("-");
      const day = parseInt(dayStr, 10);
      const monthNumber = parseInt(monthStr, 10);

      const monthName = getMonthNameFromStandardMonth(monthNumber);

      onSubmit({ day: String(day), month: monthName, time });
    }
  };

  return (
    <div className="session-form-backdrop" onClick={onClose}>
      <div className="session-form" onClick={(e) => e.stopPropagation()}>
        <div className="session-form__header">
          <h2 className="session-form__title">
            {mode === "add" ? "Add New" : "Edit"} session
          </h2>
          <Button icon="fa-close" size="small" onClick={onClose} />
        </div>
        <form onSubmit={handleSubmit} className="session-form__form">
          <FormField
            label="Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            errorMessage={errors.date}
            isRequired
            isDisabled={mode === "edit"}
          />
          <FormField
            label="Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="напр., 14:30"
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
