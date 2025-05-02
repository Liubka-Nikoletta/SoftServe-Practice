import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../Button/Button.jsx';
import './MainPage.css';
import bgImage from '../../../assets/image.png';

const MainPage = () => {
    const navigate = useNavigate();

    const handleDetailsClick = () => {
        navigate('/movie');
    };

    return (
        <div className="main-page-background" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="main-page-content">
                <h1>A Minecraft Movie</h1>
                <h2>
                    Four misfits are suddenly pulled through a mysterious portal into a bizarre
                    cubic wonderland that thrives on imagination...
                </h2>
                <Button text="Details" onClick={handleDetailsClick} />
            </div>
        </div>
    );
};

export default MainPage;