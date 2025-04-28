import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header/Header.jsx";
import Button from './components/Button/Button.jsx';
import Favorites from "./components/Pages/Favorites.jsx";
function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={
                            <div className="main-page-fon">
                                <div className="main-page-content">
                                    <h1>A Minecraft Movie</h1>
                                    <h2>Four misfits are suddenly pulled through a mysterious portal into a bizarre
                                        cubic
                                        wonderland that thrives on imagination. To get back home they'll have to master
                                        this
                                        world while embarking on a quest with an unexpected expert crafter.</h2>
                                    <Button text="Details"/>
                                </div>
                            </div>
                        }/>
                        <Route path="/favorites" element={<Favorites/>}/>
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App
