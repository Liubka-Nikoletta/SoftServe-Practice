import React from 'react';
import "./sidebar.css";

const Sidebar = () => {
    const toggleFilterMenu = () => {
        const menu = document.getElementById('categoriesMenu');
        const sortMenu = document.getElementById('sortMenu');
        
        if (sortMenu.classList.contains('show')) {
            sortMenu.classList.remove('show');
        }
        
        menu.classList.toggle('show');
    };

    const toggleSortMenu = () => {
        const menu = document.getElementById('sortMenu');
        const filterMenu = document.getElementById('categoriesMenu');
        
        if (filterMenu.classList.contains('show')) {
            filterMenu.classList.remove('show');
        }
        
        menu.classList.toggle('show');
    };

    const toggleActive = (element) => {
        const parent = element.parentElement.parentElement;
        const items = parent.querySelectorAll('.category-item, .genre-item, .age-item, .sorting-item');
        items.forEach(item => {
            item.classList.remove('active');
        });
        
        element.classList.add('active');
        console.log("Обрано: ", element.textContent);
    };

    return (
        
            
            
           
            <div id="categoriesMenu" className="categories-menu">
                <div className="menu-header">
                    <span className="menu-title"></span>
                    <button className="close-button" onClick={toggleFilterMenu}>×</button>
                </div>
                
                
                <div className="session-day-section">
                <h2>Session day</h2>
                <div className="categories-list">
                    <div className="category-row">
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>📅 Choose a date</span>
                    </div>
                    <div className="category-row">
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Today</span>
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Tomorrow</span>
                    </div>
                </div>
                </div>
                 <div className="session-time-section">
                <div className="custom-time-slider">
                <h3>Session time <span className="selected-time"></span></h3>
                <div className="slider-container">
                    <div className="slider-track">
                        <div className="slider-thumb" id="sliderThumb"></div>
                    </div>
                    <div className="time-marks">
                        <span>10:00</span>
                        <span>00:00</span>
                    </div>
                </div>
</div>
          

                <div className="genres-section">
                    <h2>Genre</h2>
                    <div className="genres-list">
                        <div className="category-row">
                            <span className="genre-item" onClick={(e) => toggleActive(e.target)}>Action</span>
                            <span className="genre-item" onClick={(e) => toggleActive(e.target)}>Comedy</span>
                        </div>
                            <div className="category-row">
                            <span className="genre-item" onClick={(e) => toggleActive(e.target)}>Documentary</span>
                            <span className="genre-item" onClick={(e) => toggleActive(e.target)}>Fantasy</span>
                        </div>
                    </div>
                </div>
                
                <div className="rating-section">
                <div className="custom-rating-slider">
                    <h3>Rating <span className="selected-rating"></span></h3>
                    <div className="slider-container">
                    <div className="slider-track">
                        <div className="slider-thumb" id="ratingThumb"></div>
                    </div>
                    <div className="rating-marks">
                        <span>1</span>
                        <span>5</span>
                    </div>
                    </div>
                </div>
                </div>
                
                <div className="age-section">
                    <h2>Age</h2>
                    <div className="age-list">
                        <div className="category-row">
                            <span className="age-item" onClick={(e) => toggleActive(e.target)}>From 0 years</span>
                            <span className="age-item" onClick={(e) => toggleActive(e.target)}>From 12 years</span>
                        </div>
                        <div className="category-row">
                            <span className="age-item" onClick={(e) => toggleActive(e.target)}>From 16 years</span>
                            <span className="age-item" onClick={(e) => toggleActive(e.target)}>From 18 years</span>
                        </div>
                    </div>
                </div>

                
                <div className="sorting-section">
                    <h2>Sort</h2>
                    <div className="sorting-list">
                        <div className="category-row">
                            <span className="sorting-item" onClick={(e) => toggleActive(e.target)}>Newest</span>
                            <span className="sorting-item" onClick={(e) => toggleActive(e.target)}>Oldest</span>
                        </div>
                
                        <div className="category-row">
                            <span className="sorting-item" onClick={(e) => toggleActive(e.target)}>Popular on IMDb</span>
                        </div>
                        <div className="category-row">
                            <span className="sorting-item" onClick={(e) => toggleActive(e.target)}>By rating (ascending)</span>
                            <span className="sorting-item" onClick={(e) => toggleActive(e.target)}>By rating (descending)</span>
                        </div>
                        
                    </div>
                </div>
            </div>
            
            <div id="sortMenu" className="sort-menu">
                
            </div>
        </div>
    );
};

export default Sidebar;