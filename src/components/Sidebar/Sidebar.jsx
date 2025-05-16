
import React, { useEffect, useState } from 'react';
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose, onFilterChange }) => {
    const sidebarClass = isOpen ? "sidebar show" : "sidebar";

    const [startTime, setStartTime] = useState(10);
    const [endTime, setEndTime] = useState(0);

    const handleStartTimeChange = (e) => {
        setStartTime(parseInt(e.target.value));
        if (onFilterChange) {
            onFilterChange('time', { start: parseInt(e.target.value), end: endTime });
        }
    };

    const formatTime = (time) => {
        const hours = Math.floor(time).toString().padStart(2, '0');
        return `${hours}:00`;
    };

    const toggleActive = (element) => {
        if (!element) return;
        const parent = element.parentElement;
        if (!parent) return;

        const itemsInGroup = parent.querySelectorAll('div[data-filter-type]');
        itemsInGroup.forEach(item => {
            item.classList.remove('active');
        });

        element.classList.add('active');
        console.log("Обрано (візуально): ", element.textContent.trim());
    };

    const handleItemClick = (e) => {
        const targetElement = e.currentTarget;
        const filterType = targetElement.dataset.filterType;
        const filterValue = targetElement.dataset.filterValue || targetElement.textContent.trim();

        toggleActive(targetElement);

        if (onFilterChange) {
            onFilterChange(filterType, filterValue);
            console.log(`Фільтр: ${filterType}, Значення: ${filterValue}`);
        }
    };

    return (
        <div id="sidebar" className={sidebarClass}>
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

            <div className="sidebar-content">
                <button onClick={onClose} className="close-sidebar-button">x</button>

                <div className="group-18482">
                    <div className="rectangle-4197"></div>
                    <div className="frame-332"></div>
                    <div className="frame-18473">
                        <div className="frame-18477">
                            <div className="session-day">День сеансу</div>
                            <div className="frame-18472">
                                <div className="frame-331" data-filter-type="date" data-filter-value="select_date" onClick={handleItemClick}>
                                    <div className="choose-a-date">📅 Виберіть день</div>
                                </div>
                                <div className="frame-331" data-filter-type="date" data-filter-value="today" onClick={handleItemClick}>
                                    <div className="today">Сьогодні</div>
                                </div>
                                <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="tomorrow">Завтра</div>
                                </div>
                            </div>
                        </div>
                            <div className="frame-18478">
                              <div className="session-time">Час сеансу</div>
                              <div className="frame-18472">
                                <div className="group-18496">
                                  <img className="line-2" src="line-20.svg" />
                                  <input
                                  type="range"
                                  min="10" 
                                  max="24" 
                                  step="1" 
                                  value={startTime}
                                  onChange={handleStartTimeChange}
                                  className="range-slider-input" // Клас для стилізації повзунка
                                />
                                <div className="slider-labels">
                                  <span className="_10-00">{formatTime(startTime)}</span>
                                  <span className="_00-002">{formatTime(endTime)}</span>
                                </div>
                                  <div className="_10-00"></div>
                                  <div className="frame-3312">
                                    <div className="_00-00">00:00</div>
                                  </div>
                                  <div className="_00-002">00:00</div>
                                  <div className="frame-3313">
                                    <div className="_10-002">10:00</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="frame-18479">
                              <div className="genre">Жанр</div>
                              <div className="frame-18472">
                                <div className="frame-331">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="action">Бойовик</div>
                                  </div>
                                </div>
                                <div className="frame-3323">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="comedy">Кримінал</div>
                                  </div>
                                </div>
                                <div className="frame-333">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="documentary">Триллер</div>
                                    </div>
                                </div>
                                <div className="frame-334">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="fantasy">Пригоди</div>
                                  </div>
                                </div>
                                <div className="frame-334">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="fantasy">Романтика</div>
                                  </div>
                                </div>
                                <div className="frame-334">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="fantasy">Містика</div>
                                  </div>
                                </div>
                                <div className="frame-334">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="fantasy">Сімейний</div>
                                  </div>
                                </div>
                                <div className="frame-334">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="fantasy">Комедія</div>
                                  </div>
                                </div>
                                <div className="frame-334">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="fantasy">Мелодрама</div>
                                  </div>
                                </div>
                                <div className="frame-334">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="fantasy">Драма</div>
                                  </div>
                                </div>
                                <div className="frame-334">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="fantasy">Фантастика</div>
                                  </div>
                                </div>
                                <div className="frame-334">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="fantasy">Фентезі</div>
                                  </div>
                                </div>
                                <div className="frame-334">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="fantasy">Кримінальний</div>
                                  </div>
                                </div>
                                
                                <div className="frame-334">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="fantasy">Психологічний</div>
                                  </div>
                                </div>
                                <div className="frame-334">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="fantasy">Жахи</div>
                                  </div>
                                </div>
                                <div className="frame-334">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="fantasy">Супергеройський фільм</div>
                                  </div>
                                </div>
                                
                              </div>
                            </div>
                            <div className="frame-18480">
                              <div className="rating">Рейтинг</div>
                              <div className="frame-18472">
                                <div className="group-184962">
                                  <img className="line-22" src="line-21.svg" />
                                  <div className="slider-wrapper">
                                  <input
                                  type="range"
                                  min="0" 
                                  max="10" 
                                  step="1" 
                                  value={startTime}
                                  onChange={handleStartTimeChange}
                                  className="range-slider-input" 
                                />
                                <div className="slider-labels">
                                  <span className="_10-00">{startTime}</span>
                                  <span className="_00-002">{endTime}</span> 
                                </div>
                                </div>
                                  <div className="_0"></div>
                                  <div className="frame-3314">
                                    <div className="_5">10</div>
                                  </div>
                                  <div className="_52">10</div>
                                  <div className="frame-3315">
                                    <div className="_02">0</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="frame-18481">
                              <div className="age">Вік</div>
                              <div className="frame-18472">
                                <div className="frame-3316">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                      <div className="from-0-years-old">0+</div>
                                  </div>
                                </div>
                                <div className="frame-3316">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="from-0-years-old">12+</div>
                                  </div>
                                </div>
                                <div className="frame-3324">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                      <div className="from-12-years-old">13+</div>
                                  </div>
                                </div>
                                <div class="frame-3332">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                      <div className="from-16-years-old">16+</div>
                                  </div>
                                </div>
                                <div className="frame-3342">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                      <div className="from-18-years-old">18+</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="frame-18482">
                              <div className="sort">Сортування</div>
                              <div className="frame-18472">
                                <div class="frame-3317">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="newest">Новинки</div>
                                  </div>
                                </div>
                                <div className="frame-3325">
                                  <div className="frame-3322" data-filter-type="date" data-filter-value="tomorrow" onClick={handleItemClick}>
                                    <div className="oldest">Популятрні на IMDb</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

            </div>
        </div>
    );
};

export default Sidebar;