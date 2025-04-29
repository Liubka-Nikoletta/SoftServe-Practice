import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>PROFILE</h3>
                    <ul>
                        <li><Link to="https://www.imdb.com/title/tt12299608/">Actors</Link></li>
                        <li><Link to="#">Directors</Link></li>
                        <li><Link to="#">Producers</Link></li>
                        <li><Link to="#">Screenwriters</Link></li>
                    </ul>
                </div>
                
                <div className="footer-section">
                    <h3>LOCATION</h3>
                    <ul>
                        <li><Link to="#">Map</Link></li>
                        <li><Link to="#">Halls</Link></li>
                        <li><Link to="#">Parking</Link></li>
                    </ul>
                </div>
                
                <div className="footer-section">
                    <h3>CONTACT</h3>
                    <ul>
                        <li><a href="mailto:info@movietheater.com">info@movietheater.com</a></li>
                        <li><a href="tel:+123456789">+12 345 6789</a></li>
                        <li><Link to="/contact">Contact form</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-divider"></div>
            
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Movie Theater. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;