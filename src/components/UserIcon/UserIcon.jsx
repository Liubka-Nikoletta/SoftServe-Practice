import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserIcon.css';

const UserIcon = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
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
    
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current && 
                !buttonRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        }
        
        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);
    
    const toggleDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDropdown(prev => !prev);
    };
    
    const handleLogout = (e) => {
        e.preventDefault();
        
        localStorage.removeItem('currentUser');
        
        document.dispatchEvent(new CustomEvent('authStatusChanged'));
        
        navigate('/login');
    };
    
    return (
        <div className="user-icon-container">
            {isLoggedIn ? (
                <>
                    <button 
                        ref={buttonRef}
                        className="user-button" 
                        onClick={toggleDropdown}
                        aria-label="User menu"
                    >
                        <i className="fa-solid fa-user"></i>
                    </button>
                    
                    {showDropdown && (
                        <div ref={dropdownRef} className="user-dropdown">
                            <div className="user-dropdown-header">
                                <span className="user-name">{userName}</span>
                            </div>
                            <div className="user-dropdown-menu">
                                <Link 
                                    to="/profile" 
                                    className="dropdown-item"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    My Profile
                                </Link>
                                <Link 
                                    to="/tickets" 
                                    className="dropdown-item"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    My Tickets
                                </Link>
                                <button 
                                    className="dropdown-item logout"
                                    onClick={handleLogout}
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <Link to="/login" className="login-button">
                    <i className="fa-solid fa-user"></i>
                </Link>
            )}
        </div>
    );
};

export default UserIcon;