import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import usersJson from '../../../assets/users.json';

const LoginPage = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const usersData = usersJson.users || [];
    
    useEffect(() => {
        document.body.classList.add('login-page-open');
        
        document.title = isLoginMode ? 'Login | Movie Theater' : 'Register | Movie Theater';
        
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            navigate('/');
        }
        
        return () => {
            document.body.classList.remove('login-page-open');
            document.title = 'Movie Theater';
        };
    }, [navigate, isLoginMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (isLoginMode) {
            const user = usersData.find(
                u => u.email === formData.email && u.password === formData.password
            );

            if (user) {
                const { password, ...userWithoutPassword } = user;
                localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
                
                document.dispatchEvent(new CustomEvent('authStatusChanged'));
   
                navigate('/');
            } else {
                setError('Incorrect email or password');
            }
        } else {
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match.');
                return;
            }

            const existingUser = usersData.find(u => u.email === formData.email);
            if (existingUser) {
                setError('A user with this email already exists.');
                return;
            }

            const newUser = {
                id: Date.now().toString(),
                email: formData.email,
                name: formData.name,
                role: 'user'
            };
            
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            document.dispatchEvent(new CustomEvent('authStatusChanged'));
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            users.push({...newUser, password: formData.password});
            localStorage.setItem('users', JSON.stringify(users));
            
            navigate('/');
        }
    };

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setError('');
        setFormData({
            email: '',
            password: '',
            name: '',
            confirmPassword: ''
        });
    };

    useEffect(() => {
        function hideUnwantedElements() {
            const elementsToHide = document.querySelectorAll('[class*="активац"], [class*="activat"]');
            elementsToHide.forEach(el => {
                el.style.display = 'none';
            });
        }
        
        hideUnwantedElements();
        
        const observer = new MutationObserver(hideUnwantedElements);
        observer.observe(document.body, { childList: true, subtree: true });
        
        return () => observer.disconnect();
    }, []);

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>{isLoginMode ? 'Login' : 'Registration'}</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    {!isLoginMode && (
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required={!isLoginMode}
                                className="form-control"
                            />
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    
                    {!isLoginMode && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required={!isLoginMode}
                                className="form-control"
                            />
                        </div>
                    )}
                    
                    <button type="submit" className="submit-button">
                        {isLoginMode ? 'Login' : 'Register'}
                    </button>
                </form>
                
                <div className="toggle-mode">
                    <p>
                        {isLoginMode 
                            ? "Don't have an account yet?" 
                            : "Already have an account?"}
                        <button type="button" onClick={toggleMode} className="toggle-button">
                            {isLoginMode ? 'Register' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;