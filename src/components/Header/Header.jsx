import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import { Link, useLocation } from "react-router-dom";
import Button from "../Button/Button.jsx";
import SearchSuggestions from "../Search/SearchSuggestions";
import UserIcon from "../UserIcon/UserIcon";
import { useForm } from "../../context/FormProvider.jsx";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [movies, setMovies] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { openForm } = useForm();

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
    const loadMovies = async () => {
      try {
        const currentMovies =
          (await import("../../assets/films.json")).default || [];
        const upcomingMovies =
          (await import("../../assets/coming_soon.json")).default || [];

        setMovies([...currentMovies, ...upcomingMovies]);
      } catch (error) {
        console.error("Error loading movie data for search:", error);
        setMovies([]);
      }
    };

    loadMovies();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filteredMovies = movies
      .filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.rating.toString().includes(searchTerm) ||
          movie.genre.some((genre) =>
            genre.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
      .slice(0, 5);

    setSuggestions(filteredMovies);
  }, [searchTerm, movies]);

  const location = useLocation();
  const [isRedBackground, setIsRedBackground] = useState(false);

  useEffect(() => {
    if (location.pathname === "/now-playing") {
      setIsRedBackground(true);
    } else {
      setIsRedBackground(false);
    }
  }, [location.pathname]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (searchTerm.trim() !== "") {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    setTimeout(() => {
      if (!searchRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
      }
    }, 200);
  };

  const handleSuggestionClick = (movie) => {
    setSearchTerm(movie.title);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("Search submitted:", searchTerm);
      setShowSuggestions(false);
    }
  };

  const handleMouseEnter = () => {
    setShowSuggestions(true);
  };

  const handleMouseLeave = () => {
    if (!isFocused) {
      setShowSuggestions(false);
    }
  };

  const handleAddMovieClick = () => {
    openForm("add", null);
    console.log("Add movie clicked");
  };

  return (
    <header className={`header ${isRedBackground ? "header--red" : ""}`}>
      <div className="header-content">
        <Link to="/" className="logo-link">
          <p className="logo-text">Movie Theater</p>
        </Link>
      </div>
      <div className="header-content right">
        {isAdmin && (
          <Button
            icon="fa-add"
            text="Add movie"
            className="admin-button"
            onClick={handleAddMovieClick}
          />
        )}
        <div className="search-wrapper" ref={searchRef}>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleSubmit}
          />
          <SearchSuggestions
            suggestions={suggestions}
            isVisible={showSuggestions}
            onSuggestionClick={handleSuggestionClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </div>
        <Link to="/favorites">
          <Button icon="fa-regular fa-heart" size="small" />
        </Link>
        <UserIcon />
      </div>
    </header>
  );
};

export default Header;
