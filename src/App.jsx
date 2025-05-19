import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import FavouritesPage from "./components/Pages/FavouritesPage/FavouritesPage.jsx";
import MovieDetailsPage from "./components/Pages/MovieDetails/MovieDetailsPage.jsx";
import MainPage from "./components/Pages/Main/MainPage.jsx";
import LoginPage from "./components/Pages/Login/LoginPage.jsx";
import CurrentlyPlaying from "./components/Pages/CurrentlyPlayingPage/CurrentlyPlaying.jsx";
import "react-toastify/dist/ReactToastify.css";

import { FormProvider, useForm } from "./context/FormProvider.jsx";
import { ToastContainer } from "react-toastify";
import MovieForm from "./components/MovieForm/MovieForm.jsx";

import AddActorForm from "./components/Form/AddActorForm/AddActorForm.jsx";

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

    let movieThatWasUpdatedOrAdded = null;

    if (formMode === "add") {
      movieThatWasUpdatedOrAdded = {
        ...formData,
        actors: formData.actors || [], 
        id: `f_${new Date().getTime()}`,
      };
      parsedMovies.push(movieThatWasUpdatedOrAdded);
       console.log("[App.jsx] Adding new movie:", movieThatWasUpdatedOrAdded);
    } else if (formMode === "edit" && formData.id) {
      parsedMovies = parsedMovies.map((movie) => {
        if (movie.id === formData.id) {
          movieThatWasUpdatedOrAdded = { 
            ...movie, 
            ...formData,
            actors: formData.actors || movie.actors || [],
          };
           console.log(
             "[App.jsx] Updating existing movie:",
             movieThatWasUpdatedOrAdded
           );
          return movieThatWasUpdatedOrAdded;
        }
        return movie;
      });
    }

     console.log(
       "[App.jsx] After mode processing, movieThatWasUpdatedOrAdded is:",
       movieThatWasUpdatedOrAdded
     );

    if (movieThatWasUpdatedOrAdded) {
      try {
        localStorage.setItem(
          moviesFromStorageKey,
          JSON.stringify(parsedMovies)
        );
         console.log(
           `[App.jsx] Movies saved to localStorage key "${moviesFromStorageKey}".`
         );

        const event = new CustomEvent("moviesUpdated", {
          detail: {
            updatedMovie: { ...movieThatWasUpdatedOrAdded },
            mode: formMode,
          },
        });
        document.dispatchEvent(event);
         console.log(
           "[App.jsx] 'moviesUpdated' event dispatched with mode:",
           formMode,
           "and movie:",
          movieThatWasUpdatedOrAdded
         );
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
            <Route path="/favorites" element={<FavouritesPage />} />
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
        <AddActorForm
          isOpen={isFormOpen}
          mode={formMode}
          initialMovieId={formMode === 'addActor' ? currentEditingSession?.movieId : null}
          initialActorData={formMode === 'editActor' ? currentEditingSession?.actorData : null}
          onClose={closeForm}
        />

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light" 
        />
      </div>
    </Router>
  );
}

export default App;