import React, { useEffect, useState } from 'react';
import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import Button from '../Button/Button.jsx';

const Header = () => {
    const location = useLocation();
    const [isRedBackground, setIsRedBackground] = useState(false);

    useEffect(() => {
        if (location.pathname === '/now-playing') {
            setIsRedBackground(true);
        } else {
            setIsRedBackground(false);
        }
    }, [location.pathname]);

    return (
        <header className={`header ${isRedBackground ? 'header--red' : ''}`}>
            <div className="header-content">
                <p className="logo-text">Movie Theater</p>
            </div>
            <div className="header-content right">
                <input type="text" placeholder="Search movies..." />
                <Link to="/favorites">
                    <Button icon="fa-regular fa-heart" size="small" />
                </Link>
                <Button icon="fa-regular fa-user" size="small" />
            </div>
        </header>
    );
};

export default Header;