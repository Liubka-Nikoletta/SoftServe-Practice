import "./SessionsSidebar.css";
import Button from "../../../../Button/Button";
import SessionCard from "../SessionCard/SessionCard";
import { useState, useEffect } from "react";
import SessionForm from "../SessionForm/SessionForm";

const SessionsSidebar = ({
  isOpen,
  onClose,
  isClosing,
  schedule: initialSchedule,
  onScheduleUpdate,
}) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableSchedule, setEditableSchedule] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [currentEditingSession, setCurrentEditingSession] = useState(null);

  useEffect(() => {
    const checkAdminStatus = () => {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "null"
      );
      setIsAdmin(currentUser && currentUser.role === "admin");
    };

    checkAdminStatus();

    const handleAuthChange = () => {
      checkAdminStatus();
    };

    document.addEventListener("authStatusChanged", handleAuthChange);

    return () => {
      document.removeEventListener("authStatusChanged", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    setEditableSchedule(
      initialSchedule
        ? initialSchedule.map((s) => ({ ...s, showtimes: [...s.showtimes] }))
        : []
    );
  }, [initialSchedule]);

  const handleToggleEditMode = () => {
    setIsEditMode((prevMode) => !prevMode);
  };

  const handleDeleteDay = (day, month) => {
    setEditableSchedule((prevSchedule) => {
      const newSchedule = prevSchedule.filter(
        (session) => !(session.day === day && session.month === month)
      );
      if (onScheduleUpdate) {
        onScheduleUpdate(newSchedule);
      }
      return newSchedule;
    });
  };

  const handleDeleteSession = (day, month, timeToDelete) => {
    setEditableSchedule((prevSchedule) => {
      const newSchedule = prevSchedule
        .map((session) => {
          if (session.day === day && session.month === month) {
            const updatedShowtimes = session.showtimes.filter(
              (time) => time !== timeToDelete
            );
            if (updatedShowtimes.length === 0) {
              return null;
            }
            return { ...session, showtimes: updatedShowtimes };
          }
          return session;
        })
        .filter(Boolean);
      if (onScheduleUpdate) {
        onScheduleUpdate(newSchedule);
      }
      return newSchedule;
    });
  };

  const handleOpenAddForm = () => {
    setFormMode("add");
    setCurrentEditingSession(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (day, month, timeToEdit) => {
    setFormMode("edit");
    setCurrentEditingSession({ day, month, originalTime: timeToEdit });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentEditingSession(null);
  };

  const handleSaveSession = (formData) => {
    const { day: formDayStr, month: formMonth, time: formTime } = formData;
    const formDay = parseInt(formDayStr);

    setEditableSchedule((prevSchedule) => {
      let updatedSchedule;

      if (formMode === "add") {
        let sessionExists = false;
        updatedSchedule = prevSchedule.map((session) => {
          if (session.day === formDay && session.month === formMonth) {
            sessionExists = true;
            const newShowtimes = [
              ...new Set([...session.showtimes, formTime]),
            ].sort();
            return { ...session, showtimes: newShowtimes };
          }
          return session;
        });
        if (!sessionExists) {
          updatedSchedule.push({
            day: formDay,
            month: formMonth,
            showtimes: [formTime],
          });
        }
      } else {
        const {
          day: originalDay,
          month: originalMonth,
          originalTime,
        } = currentEditingSession;
        updatedSchedule = prevSchedule.map((session) => {
          if (session.day === originalDay && session.month === originalMonth) {
            const newShowtimes = session.showtimes
              .filter((st) => st !== originalTime)
              .concat(formTime);
            return { ...session, showtimes: [...new Set(newShowtimes)].sort() };
          }
          return session;
        });
      }

      if (onScheduleUpdate) {
        onScheduleUpdate(updatedSchedule);
      }
      return updatedSchedule;
    });
    handleCloseForm();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`sessions-sidebar ${isClosing ? "close" : "open"}`}>
        <div className="sessions-sidebar__header">
          <Button icon="fa-close" size="small" onClick={onClose} />
        </div>
        <div className="sessions-sidebar__content">
          {isAdmin && (
            <div className="sessions-sidebar__admin-buttons">
              <Button
                icon="fa-plus"
                text="Add"
                className="sessions-sidebar__admin-button"
                onClick={handleOpenAddForm}
              />
              <Button
                icon="fa-edit"
                text="Edit"
                className="sessions-sidebar__admin-button"
                onClick={handleToggleEditMode}
              />
            </div>
          )}
          <div className="sessions-sidebar__cards">
            {editableSchedule && editableSchedule.length > 0 ? (
              editableSchedule.map((session, index) => (
                <SessionCard
                  key={`${session.month}-${session.day}-${index}`}
                  day={session.day}
                  month={session.month}
                  showtimes={session.showtimes}
                  isEditMode={isEditMode}
                  onDeleteDay={() =>
                    handleDeleteDay(session.day, session.month)
                  }
                  onDeleteShowtime={(time) =>
                    handleDeleteSession(session.day, session.month, time)
                  }
                  onEditShowtimeRequest={(time) =>
                    handleOpenEditForm(session.day, session.month, time)
                  }
                />
              ))
            ) : (
              <p className="sessions-sidebar__no-sessions">
                No sessions available. Please check back later.
              </p>
            )}
          </div>
        </div>
      </div>
      {isFormOpen && (
        <SessionForm
          mode={formMode}
          initialData={currentEditingSession}
          onClose={handleCloseForm}
          onSubmit={handleSaveSession}
        />
      )}
    </>
  );
};

export default SessionsSidebar;
