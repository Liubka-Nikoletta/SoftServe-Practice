import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import Button from '../Button/Button.jsx';

const Header = () => {
    return (
        <header className="header">
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
