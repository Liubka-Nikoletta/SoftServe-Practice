import React from "react";
import { BrowserRouter as Router, Routes, Route, Form } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Favorites from "./components/Pages/Favorites.jsx";
import MovieDetailsPage from "./components/Pages/MovieDetails/MovieDetailsPage.jsx";
import MainPage from "./components/Pages/Main/MainPage.jsx";

import LoginPage from "./components/Pages/Login/LoginPage.jsx";
import CurrentlyPlaying from "./components/Pages/CurrentlyPlayingPage/CurrentlyPlaying.jsx";

import { FormProvider, useForm } from "./context/FormProvider.jsx";
import MovieForm from "./components/MovieForm/MovieForm.jsx";

import "./App.css";

function App() {
  return (
    <FormProvider>
      <AppContent />
    </FormProvider>
  );
}

function AppContent() {
  const { isFormOpen, formMode, currentEditingSession, closeForm } = useForm();

  const handleMovieSubmit = (formData) => {
    console.log(
      "[App.jsx] handleMovieSubmit CALLED. Mode:",
      formMode,
      "Data:",
      formData
    );

    let moviesFromStorageKey = "currentlyPlaying";

    let parsedMovies = [];
    try {
      const moviesFromStorage = localStorage.getItem(moviesFromStorageKey);
      console.log("[App.jsx] moviesFromStorage string:", moviesFromStorage);
      if (moviesFromStorage) {
        parsedMovies = JSON.parse(moviesFromStorage);
      }
    } catch (error) {
      console.error("Error parsing movies from localStorage:", error);
      parsedMovies = [];
    }

    let updatedMovie = null;

    if (formMode === "add") {
      updatedMovie = {
        ...formData,
        id: `f_${new Date().getTime()}`,
      };
      parsedMovies.push(updatedMovie);
      console.log("[App.jsx] Adding new movie:", updatedMovie);
    } else if (formMode === "edit" && formData.id) {
      parsedMovies = parsedMovies.map((movie) => {
        if (movie.id === formData.id) {
          updatedMovie = { ...movie, ...formData };
          console.log("[App.jsx] Updating existing movie:", updatedMovie);
          return updatedMovie;
        }
        return movie;
      });
    }

    console.log(
      "[App.jsx] After mode processing, updatedMovie is:",
      updatedMovie
    );

    if (updatedMovie) {
      try {
        localStorage.setItem(
          moviesFromStorageKey,
          JSON.stringify(parsedMovies)
        );
        console.log(
          `[App.jsx] Movies saved to localStorage key "${moviesFromStorageKey}".`
        );
        const event = new CustomEvent("movieDataUpdated");
        document.dispatchEvent(event);
        console.log("[App.jsx] 'movieDataUpdated' event dispatched.");
      } catch (error) {
        console.error("Error saving movies to localStorage:", error);
      }
    } else {
      console.log(
        "[App.jsx] No movie was updated or added, localStorage not changed."
      );
    }

    closeForm();
    console.log("[App.jsx] Form closed.");
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/movie" element={<MovieDetailsPage />} />
            <Route path="/movie/:movieId" element={<MovieDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/now-playing" element={<CurrentlyPlaying />} />
          </Routes>
        </main>
        <Footer />
        <MovieForm
          isOpen={isFormOpen}
          onClose={closeForm}
          mode={formMode}
          initialData={currentEditingSession}
          onSubmit={handleMovieSubmit}
        />
      </div>
    </Router>
  );
}

export default App;
