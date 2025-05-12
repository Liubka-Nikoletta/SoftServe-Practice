import "./SessionCard.css";
import Button from "../../../../Button/Button";

const SessionCard = ({
  day,
  month,
  showtimes,
  isEditMode,
  onDeleteDay,
  onDeleteShowtime,
  onEditShowtimeRequest,
}) => {
  return (
    <div className="session-card">
      <div className="session-card__title-container">
        <span className="session-card__date">
          {month} {day}
        </span>
        {isEditMode && (
          <div className="session-card__edit-buttons">
            <Button
              icon="fa-close"
              size="small"
              onClick={() => onDeleteDay(day, month)}
              className="session-card__delete-button"
            />
          </div>
        )}
      </div>

      <div className="session-card__showtimes">
        {showtimes.map((time, index) => (
          <div className="session-card__showtime" key={index}>
            <Button
              key={index}
              text={time}
              onClick={
                isEditMode && onEditShowtimeRequest
                  ? () => onEditShowtimeRequest(time)
                  : undefined
              }
            />
            {isEditMode && (
              <Button
                icon="fa-close"
                size="small"
                onClick={() => onDeleteShowtime(time)}
                className="session-card__delete-button"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionCard;
