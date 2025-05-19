import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserIcon.css';

const UserIcon = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function checkAuth() {
            const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
            setIsLoggedIn(!!user);
            setUserName(user?.name || '');
        }

        checkAuth();

        const handleAuthChange = () => {
            checkAuth();
        };

        document.addEventListener('authStatusChanged', handleAuthChange);

        return () => {
            document.removeEventListener('authStatusChanged', handleAuthChange);
        };
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        document.dispatchEvent(new CustomEvent('authStatusChanged'));
        navigate('/login');
    };

    const handleMouseLeave = (e) => {
        if (!containerRef.current) return;
        const related = e.relatedTarget;
        if (related && containerRef.current.contains(related)) {
            return;
        }
        setShowDropdown(false);
    };

    return (
        <div
            className="user-icon-container"
            ref={containerRef}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={handleMouseLeave}
        >
            <button className="user-button" aria-label="User menu">
                <i className="fa-solid fa-user"></i>
            </button>

            {showDropdown && (
                <div className="user-dropdown">
                    {isLoggedIn ? (
                        <>
                            <div className="user-dropdown-header">
                                <span className="user-name">{userName}</span>
                            </div>
                            <div className="user-dropdown-menu">
                                <button className="dropdown-item logout" onClick={handleLogout}>
                                    Sign Out
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="user-dropdown-menu">
                            <button
                                className="dropdown-item"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserIcon;
