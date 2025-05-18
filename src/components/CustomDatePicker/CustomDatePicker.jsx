import React, { useState, useEffect } from 'react';
import './CustomDatePicker.css';

const CustomDatePicker = ({ onDateSelect, initialSelectedDate, onClose }) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  useEffect(() => {
    if (initialSelectedDate) {
      const initial = new Date(initialSelectedDate + "T00:00:00"); 
      if (!isNaN(initial.getTime())) {
        setSelectedDate(initial);
        setCurrentMonthDate(new Date(initial.getFullYear(), initial.getMonth(), 1));
      }
    } else {
        setCurrentMonthDate(new Date(today.getFullYear(), today.getMonth(), 1));
    }
  }, [initialSelectedDate]);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); 

  const changeMonth = (offset) => {
    setCurrentMonthDate(prev => {
      const newMonth = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
      return newMonth;
    });
  };

  const handleDayClick = (day) => {
    const date = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), day);
    date.setHours(0,0,0,0);
    setSelectedDate(date);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    onDateSelect(`${year}-${month}-${dayStr}`);
    if (onClose) onClose(); 
  };

  const renderHeader = () => {
    const monthName = currentMonthDate.toLocaleDateString('uk-UA', { month: 'long' });
    const year = currentMonthDate.getFullYear();
    return (
      <div className="cdp-header">
        <button onClick={() => changeMonth(-1)} className="cdp-nav-button">&lt;</button>
        <span>{`${monthName} ${year}`}</span>
        <button onClick={() => changeMonth(1)} className="cdp-nav-button">&gt;</button>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
    return (
      <div className="cdp-weekdays">
        {dayNames.map(day => <div key={day} className="cdp-weekday">{day}</div>)}
      </div>
    );
  };

  const renderCalendarGrid = () => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const numDays = daysInMonth(year, month);
    let firstDay = firstDayOfMonth(year, month);
    firstDay = firstDay === 0 ? 6 : firstDay - 1; // Пн = 0, Нд = 6

    const blanks = Array(firstDay).fill(null);
    const daysArray = Array.from({ length: numDays }, (_, i) => i + 1);

    const cells = [...blanks, ...daysArray].map((day, index) => {
      if (day === null) {
        return <div key={`blank-${index}`} className="cdp-day cdp-day-empty"></div>;
      }
      const currentDateObj = new Date(year, month, day);
      currentDateObj.setHours(0,0,0,0); 

      let dayClasses = "cdp-day";
      if (selectedDate && currentDateObj.getTime() === selectedDate.getTime()) {
        dayClasses += " cdp-day-selected";
      }
      if (currentDateObj.getTime() === today.getTime()) {
        dayClasses += " cdp-day-today";
      }
      return (
        <div key={day} className={dayClasses} onClick={() => handleDayClick(day)}>
          {day}
        </div>
      );
    });

    return <div className="cdp-grid">{cells}</div>;
  };

  return (
    <div className="custom-date-picker">
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCalendarGrid()}
      {onClose && (
          <button onClick={onClose} className="cdp-close-button">Закрити</button>
      )}
    </div>
  );
};

export default CustomDatePicker;