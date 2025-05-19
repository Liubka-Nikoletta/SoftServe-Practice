import "./MovieForm.css";
import FormField from "../Form/FormField/FormField";
import FormSubmit from "../Form/FormSubmit/FormSubmit";
import Button from "../Button/Button";
import { useState, useEffect } from "react";
import FormTextarea from "../Form/FormTextarea/FormTextarea";
import StarRating from "../Form/StarRating/StarRating";
import FormCheckboxes from "../Form/FormCheckboxes/FormCheckboxes";

const formatDateToInput = (dateStr_DDMMYYYY) => {
  if (!dateStr_DDMMYYYY || !/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr_DDMMYYYY))
    return "";
  const parts = dateStr_DDMMYYYY.split(".");
  if (parts.length !== 3) return "";
  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
};

const formatDateToJSON = (dateStr_YYYYMMDD) => {
  if (!dateStr_YYYYMMDD || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr_YYYYMMDD))
    return "";
  const parts = dateStr_YYYYMMDD.split("-");
  if (parts.length !== 3) return "";
  const [year, month, day] = parts;
  return `${day}.${month}.${year}`;
};

const ageRatingOptions = [
  { value: "0+", label: "0+" },
  { value: "6+", label: "6+" },
  { value: "12+", label: "12+" },
  { value: "13+", label: "13+" },
  { value: "16+", label: "16+" },
  { value: "18+", label: "18+" },
];

const availableGenres = [
  "Бойовик", "Детектив", "Драма", "Жахи", "Комедія", "Кримінал", 
  "Кримінальний", "Мелодрама", "Містика", "Пригоди", "Психологічний", 
  "Романтика", "Сімейний", "Супергеройський фільм", "Трилер", 
  "Фантастика", "Фентезі",
].sort();

const MovieForm = ({ onClose, onSubmit, mode, initialData, isOpen }) => {
  if (!isOpen || (mode !== "add" && mode !== "edit")) {
    return null;
  }

  const [title, setTitle] = useState("");
  const [poster, setPoster] = useState("");
  const [rating, setRating] = useState(null);
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [releaseDate, setReleaseDate] = useState("");
  const [duration, setDuration] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [actors, setActors] = useState(""); 
  const [ticketPrice, setTicketPrice] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTitle(initialData.title || "");
      setPoster(initialData.poster || "");
      setRating(
        initialData.rating !== undefined && initialData.rating !== null
          ? Number(initialData.rating)
          : null
      );
      setAge(initialData.age || "");
      setDescription(initialData.description || "");
      setSelectedGenres(initialData.genre || []);
      setReleaseDate(formatDateToInput(initialData.release_date || ""));
      setDuration(initialData.duration || "");
      setTrailerUrl(initialData.trailer_url || "");
      setActors(initialData.actors ? initialData.actors.join(", ") : ""); 
      setTicketPrice(String(initialData.ticket_price || ""));
      setBackgroundImage(initialData.background_image || "");
    } else {
      setTitle("");
      setPoster("");
      setRating(null);
      setAge(ageRatingOptions[0]?.value || "");
      setDescription("");
      setSelectedGenres([]);
      setReleaseDate("");
      setDuration("");
      setTrailerUrl("");
      setActors("");
      setTicketPrice("");
      setBackgroundImage("");
    }
    setErrors({});
  }, [mode, initialData]);

  const handleGenreChange = (genreName) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genreName)
        ? prevGenres.filter((g) => g !== genreName)
        : [...prevGenres, genreName]
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!poster.trim()) newErrors.poster = "Poster URL is required";

    if (rating === null) {
      newErrors.rating = "Rating is required";
    } else if (typeof rating !== "number" || rating < 0 || rating > 10) {
      newErrors.rating = "Rating must be between 0 and 10";
    }

    if (!age.trim()) newErrors.age = "Age rating is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (selectedGenres.length === 0)
      newErrors.genre = "At least one genre is required";

    if (!releaseDate) newErrors.releaseDate = "Release date is required";

    if (!duration.trim()) newErrors.duration = "Duration is required";
    else if (!/^\d+:\d{2}$/.test(duration)) {
      newErrors.duration = "Duration must be in H:MM format";
    }
    if (!trailerUrl.trim()) newErrors.trailerUrl = "Trailer URL is required";
    else if (!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(trailerUrl)) {
      newErrors.trailerUrl = "Invalid trailer URL";
    }
    if (ticketPrice.trim() === "")
      newErrors.ticketPrice = "Ticket price is required";
    else if (isNaN(parseFloat(ticketPrice)) || parseFloat(ticketPrice) <= 0) {
      newErrors.ticketPrice = "Ticket price must be a positive number";
    }
    if (!backgroundImage.trim())
      newErrors.backgroundImage = "Background image URL is required";
  

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const movieData = {
        title,
        poster,
        rating: rating,
        age,
        description,
        genre: selectedGenres,
        release_date: formatDateToJSON(releaseDate),
        duration,
        trailer_url: trailerUrl,
        ticket_price: parseFloat(ticketPrice),
        background_image: backgroundImage,
        actors: initialData?.actors || [], 
      };
      if (mode === "edit" && initialData && initialData.id) {
        movieData.id = initialData.id;
      }
      onSubmit(movieData);
    }
  };

  return (
    <div className="movie-form-backdrop" onClick={onClose}>
      <div className="movie-form" onClick={(e) => e.stopPropagation()}>
        <div className="movie-form__header">
          <h2 className="movie-form__title">
            {mode === "add" ? "Add New" : "Edit"} Movie 
          </h2>
          <Button icon="fa-close" size="small" onClick={onClose} />
        </div>
        <form onSubmit={handleSubmit} className="movie-form__form">
          <FormField
            label="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter movie title"
            errorMessage={errors.title}
            isRequired
          />
          <div className="movie-form__columns">
            <FormField
              label="Release Date"
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              errorMessage={errors.releaseDate}
              isRequired
            />
            <FormField
              label="Age Rating"
              type="select"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              options={ageRatingOptions}
              errorMessage={errors.age}
              isRequired
            />
          </div>
          <div className="movie-form__columns">
            <FormField
              label="Duration"
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="H:MM, e.g., 1:45"
              errorMessage={errors.duration}
              isRequired
            />
            <StarRating
              maxRating={10}
              rating={rating}
              onRatingChange={setRating}
              errorMessage={errors.rating}
            />
            <FormField
              label="Ticket Price"
              type="number"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              placeholder="e.g., 150"
              errorMessage={errors.ticketPrice}
              isRequired
              min="0.01" 
              step="any"
            />
          </div>
          <FormCheckboxes
            checkboxes={availableGenres}
            selectedCheckboxes={selectedGenres}
            onCheckboxChange={handleGenreChange}
            error={errors.genre}
            isRequired={true}
          />
          <FormTextarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter movie description"
            errorMessage={errors.description}
            isRequired
          />
          <FormField
            label="Trailer URL"
            type="text"
            value={trailerUrl}
            onChange={(e) => setTrailerUrl(e.target.value)}
            placeholder="e.g., https://youtu.be/example"
            errorMessage={errors.trailerUrl}
            isRequired
          />
          <div className="movie-form__columns">
            <FormField
              label="Background URL"
              type="text"
              value={backgroundImage}
              onChange={(e) => setBackgroundImage(e.target.value)}
              placeholder="e.g., src/assets/posters/Movie_bg.jpg"
              errorMessage={errors.backgroundImage}
              isRequired
            />
            <FormField
              label="Poster URL"
              type="text"
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
              placeholder="e.g., src/assets/posters/Movie.jpg"
              errorMessage={errors.poster}
              isRequired
            />
          </div>
          <FormSubmit isDisabled={false} />
        </form>
      </div>
    </div>
  );
};

export default MovieForm;