import React from 'react';
import './Button.css';

const Button = ({ text, onClick, icon, size = 'medium' }) => {
    return (
        <button className={`details-button ${size}`} onClick={onClick}>
            {icon && <i className={`fa ${icon}`}></i>}
            {text && <span>{text}</span>}
        </button>
    );
};

export default Button;
