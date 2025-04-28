import React from 'react';
import './Header.css';
import {Link} from "react-router-dom";

const Header = () => {
    return (
        <header className="header">
            <div className="header-content">
                <p className="logo-text">Movie Theater</p>
            </div>
            <div className="header-content right">
                <input type="text" placeholder="Search movies..." />
                <Link to="/favorites">
                    <img src="/favourite.png" alt="Icon representing favorite movies" className="icon"/>
                </Link>
                <img src="/userAvatar.png" alt="User avatar icon" className="icon"/>
            </div>
        </header>
    );
}

export default Header;
