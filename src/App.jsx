import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import FavouritesPage  from "./components/Pages/FavouritesPage/FavouritesPage.jsx";
import MovieDetailsPage from "./components/Pages/MovieDetails/MovieDetailsPage.jsx";
import MainPage from "./components/Pages/Main/MainPage.jsx";
import CurrentlyPlaying from "./components/Pages/CurrentlyPlayingPage/CurrentlyPlaying.jsx";
import Sidebar from './components/Sidebar/Sidebar.jsx';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const [filters, setFilters] = useState({
        date: null,
        time: { start: 0, end: 24 }, 
        genre: null,
        rating: 0,
        age: null,
        sort: null,
    });


  
    const handleFilterChange = (filterType, value) => {
        console.log(`Оновлення фільтра: Тип=${filterType}, Значення=`, value); 
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterType]: value,
        }));
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
  
    return (
        <Router>
            <div className="App">
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/favorites" element={<FavouritesPage />} />
                        <Route path="/movie" element={<MovieDetailsPage />} />
                        <Route path="/movie/:movieId" element={<MovieDetailsPage />} />
                        <Route path="/now-playing" element={<CurrentlyPlaying />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App