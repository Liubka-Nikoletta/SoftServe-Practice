import "./MovieForm.css";
import FormField from "../FormField/FormField";
import FormSubmit from "../FormSubmit/FormSubmit";
import Button from "../Button/Button";
import { useState, useEffect } from "react";
import FormTextarea from "../FormTextarea/FormTextarea";

const MovieForm = ({ onClose, onSubmit, mode, initialData, isOpen }) => {
  if (!isOpen) {
    return null;
  }

  const [title, setTitle] = useState("");
  const [poster, setPoster] = useState("");
  const [rating, setRating] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
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
      setRating(String(initialData.rating || ""));
      setAge(initialData.age || "");
      setDescription(initialData.description || "");
      setGenre(initialData.genre ? initialData.genre.join(", ") : "");
      setReleaseDate(initialData.release_date || "");
      setDuration(initialData.duration || "");
      setTrailerUrl(initialData.trailer_url || "");
      setActors(initialData.actors ? initialData.actors.join(", ") : "");
      setTicketPrice(String(initialData.ticket_price || ""));
      setBackgroundImage(initialData.background_image || "");
    } else {
      setTitle("");
      setPoster("");
      setRating("");
      setAge("");
      setDescription("");
      setGenre("");
      setReleaseDate("");
      setDuration("");
      setTrailerUrl("");
      setActors("");
      setTicketPrice("");
      setBackgroundImage("");
    }
    setErrors({});
  }, [mode, initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!poster.trim()) newErrors.poster = "Poster URL is required";
    if (!rating) newErrors.rating = "Rating is required";
    else if (
      isNaN(rating) ||
      parseFloat(rating) < 0 ||
      parseFloat(rating) > 10
    ) {
      newErrors.rating = "Rating must be a number between 0 and 10";
    }
    if (!age.trim()) newErrors.age = "Age rating is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!genre.trim()) newErrors.genre = "Genre(s) are required";
    if (!releaseDate.trim()) newErrors.releaseDate = "Release date is required";
    else if (!/^\d{2}\.\d{2}\.\d{4}$/.test(releaseDate)) {
      newErrors.releaseDate = "Invalid release date format (DD.MM.YYYY)";
    }
    if (!duration.trim()) newErrors.duration = "Duration is required";
    else if (!/^\d+:\d{2}$/.test(duration)) {
      newErrors.duration = "Invalid duration format (H:MM)";
    }
    if (!trailerUrl.trim()) newErrors.trailerUrl = "Trailer URL is required";
    else if (!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(trailerUrl)) {
      newErrors.trailerUrl = "Invalid trailer URL format";
    }
    if (!ticketPrice) newErrors.ticketPrice = "Ticket price is required";
    else if (isNaN(ticketPrice) || parseFloat(ticketPrice) <= 0) {
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
        rating: parseFloat(rating),
        age,
        description,
        genre: genre
          .split(",")
          .map((g) => g.trim())
          .filter((g) => g),
        release_date: releaseDate,
        duration,
        trailer_url: trailerUrl,
        ticket_price: parseFloat(ticketPrice),
        background_image: backgroundImage,
        actors: [],
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
          <div className="movie-form__two-columns">
            <FormField
              label="Release Date"
              type="text"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              placeholder="DD.MM.YYYY"
              errorMessage={errors.releaseDate}
              isRequired
            />
            <FormField
              label="Age Rating"
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 16+"
              errorMessage={errors.age}
              isRequired
            />
          </div>
          <div className="movie-form__two-columns">
            <FormField
              label="Duration"
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="H:MM, e.g., 1:45"
              errorMessage={errors.duration}
              isRequired
            />
            <FormField
              label="Genre (comma-separated)"
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g., Action, Thriller, Drama"
              errorMessage={errors.genre}
              isRequired
            />
          </div>
          <FormTextarea
            label={"Description"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter movie description"
            errorMessage={errors.description}
            isRequired
          />
          <div className="movie-form__two-columns">
            <FormField
              label="Ticket Price"
              type="number"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              placeholder="e.g., 150"
              errorMessage={errors.ticketPrice}
              isRequired
            />
            <FormField
              label="Rating"
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="e.g., 7.5"
              errorMessage={errors.rating}
              isRequired
              step="0.1"
            />
          </div>
          <FormField
            label="Trailer URL"
            type="text"
            value={trailerUrl}
            onChange={(e) => setTrailerUrl(e.target.value)}
            placeholder="e.g., https://youtu.be/example"
            errorMessage={errors.trailerUrl}
            isRequired
          />
          <FormField
            label="Background Image URL"
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
          <FormSubmit isDisabled={false} />
        </form>
      </div>
    </div>
  );
};

export default MovieForm;
