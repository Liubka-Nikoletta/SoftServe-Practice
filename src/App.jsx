import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Favorites from "./components/Pages/Favorites.jsx";
import MovieDetailsPage from "./components/Pages/MovieDetails/MovieDetailsPage.jsx";
import MainPage from "./components/Pages/Main/MainPage.jsx";
import LoginPage from "./components/Pages/Login/LoginPage.jsx"; 
import './App.css';

function App() {
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
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;