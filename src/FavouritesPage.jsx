import React from 'react';
import './FavouritePage.css';

const FavouritePage = () => {
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
        <div className="favorites-section">
            <div className="main-header">
                <span className="section-title">Your favourites</span>
                <div className="filter-sort">
                    <button className="toggle-button" onClick={toggleFilterMenu}>⚙️ Filter</button>
                    <button className="toggle-button" onClick={toggleSortMenu}>↓↑ Sort</button>
                </div>
            </div> 
            
            {/* Filter Menu */}
            <div id="categoriesMenu" className="categories-menu">
                <div className="menu-header">
                    <span className="menu-title">Фільтрація</span>
                    <button className="close-button" onClick={toggleFilterMenu}>×</button>
                </div>
                <div className="divider"></div>
                
                <h2>Категорія</h2>
                <div className="categories-list">
                    <div className="category-row">
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Розважальний</span>
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Спортивний</span>
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Жахи</span>
                    </div>
                    <div className="category-row">
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Документальний</span>
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Кримінал</span>
                    </div>
                    <div className="category-row">
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Історичний</span>
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Авторське</span>
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Азійське</span>
                    </div>
                    <div className="category-row">
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Блокбастер</span>
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Європейське</span>
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Класика</span>
                    </div>
                    <div className="category-row">
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Комікс</span>
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Українське</span>
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Фестивальне</span>
                    </div>
                    <div className="category-row">
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Дітям</span>
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Голівудське</span>
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Фантастичне</span>
                    </div>
                    <div className="category-row">
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Музичне</span>
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Космічне</span>
                    </div>
                    <div className="category-row">
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Ексклюзивне</span>
                        <span className="category-item" onClick={(e) => toggleActive(e.target)}>Екранізація</span>
                    </div>
                </div>
                
                <div className="genres-section">
                    <h2>Жанр</h2>
                    <div className="genres-list">
                        <div className="category-row">
                            <span className="genre-item" onClick={(e) => toggleActive(e.target)}>Комедія</span>
                            <span className="genre-item" onClick={(e) => toggleActive(e.target)}>Мелодрама</span>
                            <span className="genre-item" onClick={(e) => toggleActive(e.target)}>Драма</span>
                        </div>
                    </div>
                </div>
                
                <div className="age-section">
                    <h2>Можна дивитися глядачам</h2>
                    <div className="age-list">
                        <div className="category-row">
                            <span className="age-item" onClick={(e) => toggleActive(e.target)}>Від 0 років</span>
                            <span className="age-item" onClick={(e) => toggleActive(e.target)}>Від 12 років</span>
                        </div>
                        <div className="category-row">
                            <span className="age-item" onClick={(e) => toggleActive(e.target)}>Від 16 років</span>
                            <span className="age-item" onClick={(e) => toggleActive(e.target)}>Від 18 років</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Sort Menu */}
            <div id="sortMenu" className="sort-menu">
                <div className="menu-header">
                    <span className="menu-title">Сортування</span>
                    <button className="close-button" onClick={toggleSortMenu}>×</button>
                </div>
                <div className="divider"></div>
                
                <div className="sorting-section">
                    <h2>Сортувати за:</h2>
                    <div className="sorting-list">
                        <div className="category-row">
                            <span className="sorting-item" onClick={(e) => toggleActive(e.target)}>Новинки</span>
                        </div>
                        <div className="category-row">
                            <span className="sorting-item" onClick={(e) => toggleActive(e.target)}>Популярні на IMDb</span>
                        </div>
                        <div className="category-row">
                            <span className="sorting-item" onClick={(e) => toggleActive(e.target)}>Популярні на Rotten Tomatoes</span>
                        </div>
                        <div className="category-row">
                            <span className="sorting-item" onClick={(e) => toggleActive(e.target)}>За алфавітом (А-Я)</span>
                        </div>
                        <div className="category-row">
                            <span className="sorting-item" onClick={(e) => toggleActive(e.target)}>За алфавітом (Я-А)</span>
                        </div>
                        <div className="category-row">
                            <span className="sorting-item" onClick={(e) => toggleActive(e.target)}>За рейтингом (зростання)</span>
                        </div>
                        <div className="category-row">
                            <span className="sorting-item" onClick={(e) => toggleActive(e.target)}>За рейтингом (спадання)</span>
                        </div>
                        <div className="category-row">
                            <span className="sorting-item" onClick={(e) => toggleActive(e.target)}>За роком випуску (нові)</span>
                        </div>
                        <div className="category-row">
                            <span className="sorting-item" onClick={(e) => toggleActive(e.target)}>За роком випуску (старі)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FavouritePage;