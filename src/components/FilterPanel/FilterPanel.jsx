import React, { useState, useEffect, useRef, useCallback } from 'react';
import './FilterPanel.css'; 
import FilterCard from '../FilterCard/FilterCard'; 
import { v4 as uuidv4 } from 'uuid';
import CustomDatePicker from '../CustomDatePicker/CustomDatePicker'; 

const RangeSlider = React.memo(function RangeSlider({ title, min, max, value, onChange, formatLabel, step: propStep }) {
  const [currentMinValue, setCurrentMinValue] = useState(value[0]);
  const [currentMaxValue, setCurrentMaxValue] = useState(value[1]);

  const sliderRef = useRef(null);
  const dragStateRef = useRef({
    type: null,
    initialMouseX: 0,
    sliderWidth: 0,
    sliderLeft: 0
  });
  const internalValueRef = useRef([value[0], value[1]]);

  useEffect(() => {
    internalValueRef.current = [currentMinValue, currentMaxValue];
  }, [currentMinValue, currentMaxValue]);

  const isTimeSlider = title.toLowerCase().includes('час');
  const step = propStep !== undefined ? propStep : (isTimeSlider ? 1 : 0.1);


  useEffect(() => {
    if (value[0] !== currentMinValue) {
      setCurrentMinValue(value[0]);
    }
    if (value[1] !== currentMaxValue) {
      setCurrentMaxValue(value[1]);
    }
  }, [value, currentMinValue, currentMaxValue]);

  const getThumbPercent = useCallback((val) => {
    if (max === min) return 0;
    const percent = ((val - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, percent));
  }, [min, max]);

  const getValueFromPercent = useCallback((percent) => {
    let rawValue = min + (percent / 100) * (max - min);
    let steppedValue = Math.round(rawValue / step) * step;
    steppedValue = Math.max(min, Math.min(max, steppedValue));
    return isTimeSlider ? Math.round(steppedValue) : parseFloat(steppedValue.toFixed(step.toString().includes('.') ? step.toString().split('.')[1].length : 0));
  }, [min, max, step, isTimeSlider]);

  const handleMouseMoveDocument = useCallback((event) => {
    if (!dragStateRef.current.type || dragStateRef.current.sliderWidth === 0) return;
    event.preventDefault();

    const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
    const { type, sliderWidth, sliderLeft } = dragStateRef.current;
    const [calcMinVal, calcMaxVal] = internalValueRef.current;

    const mouseXOnSlider = clientX - sliderLeft;
    let newPercent = (mouseXOnSlider / sliderWidth) * 100;
    newPercent = Math.max(0, Math.min(100, newPercent));
    let newValue = getValueFromPercent(newPercent);

    let newMin = calcMinVal;
    let newMax = calcMaxVal;

    if (type === 'min') {
      newValue = Math.min(newValue, calcMaxVal - step);
      newValue = Math.max(min, newValue);
      newMin 
      newValue = Math.max(newValue, calcMinVal + step);
      newValue = Math.min(max, newValue);
      newMax = newValue;
    }

    if (newMin !== calcMinVal || newMax !== calcMaxVal) {
        onChange([newMin, newMax]);
    }

  }, [getValueFromPercent, onChange, min, max, step, isTimeSlider]);

  const handleMouseUpDocument = useCallback(() => {
    if (dragStateRef.current.type) {
      dragStateRef.current.type = null;
      document.removeEventListener('mousemove', handleMouseMoveDocument);
      document.removeEventListener('mouseup', handleMouseUpDocument);
      document.removeEventListener('touchmove', handleMouseMoveDocument);
      document.removeEventListener('touchend', handleMouseUpDocument);
    }
  }, [handleMouseMoveDocument]);

  const handleMouseDown = useCallback((thumbTypeToDrag, event) => {
    event.preventDefault();
    if (!sliderRef.current) {
      console.error(`[RangeSlider "${title}" handleMouseDown] Slider ref is not available!`);
      return;
    }

    const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
    const sliderRect = sliderRef.current.getBoundingClientRect();

    if (sliderRect.width === 0) {
      console.warn(`[RangeSlider "${title}" handleMouseDown] УВАГА: Ширина слайдера (${title}) дорівнює 0. Перетягування може не працювати коректно.`);
    }

    let actualThumbType = thumbTypeToDrag;
    if ((event.target === sliderRef.current || event.target === sliderRef.current.querySelector('.slider-track')) && !thumbTypeToDrag) {
        const clickPercent = ((clientX - sliderRect.left) / sliderRect.width) * 100;
        const clickValue = getValueFromPercent(clickPercent);
        if (Math.abs(clickValue - internalValueRef.current[0]) < Math.abs(clickValue - internalValueRef.current[1])) {
            actualThumbType = 'min';
            const newMin = Math.min(Math.max(clickValue, min), internalValueRef.current[1] - step);
            onChange([newMin, internalValueRef.current[1]]);
        } else {
            actualThumbType = 'max';
            const newMax = Math.max(Math.min(clickValue, max), internalValueRef.current[0] + step);
            onChange([internalValueRef.current[0], newMax]);
        }
    }

    dragStateRef.current = {
      type: actualThumbType,
      initialMouseX: clientX,
      sliderWidth: sliderRect.width,
      sliderLeft: sliderRect.left,
    };


    document.addEventListener('mousemove', handleMouseMoveDocument);
    document.addEventListener('mouseup', handleMouseUpDocument);
    document.addEventListener('touchmove', handleMouseMoveDocument, { passive: false });
    document.addEventListener('touchend', handleMouseUpDocument);

  }, [title, getValueFromPercent, handleMouseMoveDocument, handleMouseUpDocument, onChange, min, max, step, internalValueRef]);

  useEffect(() => {
    const cleanupDrag = handleMouseUpDocument;
    return () => {
      if (dragStateRef.current.type) {
        cleanupDrag();
      }
    };
  }, [handleMouseUpDocument]);

  const minPercent = getThumbPercent(currentMinValue);
  const maxPercent = getThumbPercent(currentMaxValue);

  return (
    <FilterCard title={title}>
      <div className="range-slider-container">
        <div className="slider-labels">
          <div className="thumb-label" style={{ left: `${minPercent}%`, transform: 'translateX(-50%)' }}>
            <span className="label-background">{formatLabel(currentMinValue)}</span>
          </div>
          <div className="thumb-label" style={{ left: `${maxPercent}%`, transform: 'translateX(-50%)'  }}>
            <span className="label-background">{formatLabel(currentMaxValue)}</span>
          </div>
        </div>
        <div
          className="slider"
          ref={sliderRef}
          onMouseDown={(e) => {
             if (e.target === sliderRef.current || e.target.classList.contains('slider-track')) {
              handleMouseDown(null, e);
            }
          }}
          onTouchStart={(e) => {
             if (e.target === sliderRef.current || e.target.classList.contains('slider-track')) {
              handleMouseDown(null, e);
            }
          }}
        >
          <div
            className="slider-thumb slider-thumb-min"
            style={{ left: `${minPercent}%`, zIndex: dragStateRef.current.type === 'min' || (dragStateRef.current.type !== 'max' && minPercent <= maxPercent) ? 3 : 1 }}
            onMouseDown={(e) => { e.stopPropagation(); handleMouseDown('min', e); }}
            onTouchStart={(e) => { e.stopPropagation(); handleMouseDown('min', e); }}
          />
          <div
            className="slider-thumb slider-thumb-max"
            style={{ left: `${maxPercent}%`, zIndex: dragStateRef.current.type === 'max' || (dragStateRef.current.type !== 'min' && maxPercent > minPercent) ? 3 : 1 }}
            onMouseDown={(e) => { e.stopPropagation(); handleMouseDown('max', e); }}
            onTouchStart={(e) => { e.stopPropagation(); handleMouseDown('max', e); }}
          />
          <div
            className="slider-track"
            style={{
              left: `${Math.min(minPercent, maxPercent)}%`,
              width: `${Math.abs(maxPercent - minPercent)}%`,
            }}
          />
        </div>
        <div className="slider-endpoints">
          <span>{formatLabel(min)}</span>
          <span>{formatLabel(max)}</span>
        </div>
      </div>
    </FilterCard>
  );
});


const FilterPanel = ({ isOpen, onClose, onFilterChange }) => {
  const [genres, setGenres] = useState([]);
  const [ageRatings, setAgeRatings] = useState([]);
  const [ratingRange, setRatingRange] = useState([0, 10]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedAgeRatings, setSelectedAgeRatings] = useState([]);
  const [sortBy, setSortBy] = useState('');

  const [selectedDateType, setSelectedDateType] = useState(null);
  const [chosenSpecificDate, setChosenSpecificDate] = useState(null);

  const [sessionTimeRange, setSessionTimeRange] = useState([0, 24 * 60 - 1]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    const loadFilterOptions = () => {
      try {
        const storedCurrentlyPlaying = localStorage.getItem("currentlyPlaying");
        const storedComingSoon = localStorage.getItem("comingSoon");

        let films = [];
        if (storedCurrentlyPlaying) {
          films = films.concat(JSON.parse(storedCurrentlyPlaying));
        }
        if (storedComingSoon) {
          films = films.concat(JSON.parse(storedComingSoon));
        }

        const uniqueFilms = films.filter((film, index, self) =>
            film && film.id && index === self.findIndex((f) => (
                f && f.id === film.id
            ))
        );

        const uniqueGenres = [...new Set(uniqueFilms.reduce((acc, film) => acc.concat(film.genre || []), []))].filter(Boolean).sort();
        setGenres(uniqueGenres);

        const uniqueAgeRatings = [...new Set(uniqueFilms.map(film => film.age))].filter(Boolean).sort();
        setAgeRatings(uniqueAgeRatings);

      } catch (error) {
        console.error("[FilterPanel useEffect loadFilterOptions] Помилка завантаження даних для фільтрації з localStorage:", error);
      }
    };
    loadFilterOptions();
  }, []);

  const handleGenreChange = useCallback((genre) => {
    setSelectedGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
  }, []);

  const handleAgeRatingChange = useCallback((age) => {
    setSelectedAgeRatings(prev => prev.includes(age) ? prev.filter(a => a !== age) : [...prev, age]);
  }, []);

  const handleRatingChange = useCallback((values) => {
    setRatingRange(values);
  }, []);

  const handleSessionTimeChange = useCallback((values) => {
    setSessionTimeRange(values);
  }, []);

  const handleSortChange = useCallback((sortType) => {
    setSortBy(prevSortBy => (prevSortBy === sortType ? '' : sortType));
  }, []);

  const handleQuickDateChange = useCallback((type) => {
    if (selectedDateType === type && type !== 'specific') {
      setSelectedDateType(null);
      setChosenSpecificDate(null);
    } else {
      setSelectedDateType(type);
      setChosenSpecificDate(null);
      setIsDatePickerOpen(false);
    }
  }, [selectedDateType]);

  const handleSpecificDateSelect = useCallback((dateString) => {
    setChosenSpecificDate(dateString);
    setSelectedDateType('specific');
    setIsDatePickerOpen(false);
  }, []);

  const toggleDatePicker = () => {
    setIsDatePickerOpen(prev => {
        const opening = !prev;
        if (opening) {
            if (selectedDateType === 'today' || selectedDateType === 'tomorrow') {
                setSelectedDateType('specific');
            } else if (!chosenSpecificDate) { 
                 setSelectedDateType('specific');
            }
        } else {
            if (!chosenSpecificDate && selectedDateType === 'specific') {
            }
        }
        return opening;
    });
  };


  const formatTimeLabel = useCallback((minutes) => {
    const totalMinutes = Math.min(Math.max(0, minutes), 24 * 60 - 1);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }, []);

  const formatRatingLabel = useCallback((value) => value.toFixed(1), []);

  const applyFilters = useCallback(() => {
    const filters = {
      sessionDateFilter: {
        type: selectedDateType,
        date: chosenSpecificDate,
      },
      sessionStartTime: sessionTimeRange[0],
      sessionEndTime: sessionTimeRange[1],
      minRating: ratingRange[0],
      maxRating: ratingRange[1],
      genres: selectedGenres,
      ageRatings: selectedAgeRatings,
      sortBy: sortBy,
    };
    onFilterChange(filters);
    onClose();
  }, [selectedDateType, chosenSpecificDate, sessionTimeRange, ratingRange, selectedGenres, selectedAgeRatings, sortBy, onFilterChange, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`filter-panel ${isOpen ? 'open' : ''}`}>
      <div className="filter-panel__header">
        <button onClick={onClose} className="filter-panel__close-button">
          <i className="fa fa-times"></i> {}
        </button>
      </div>
      <div className="filter-panel__content">
        <FilterCard title="День сеансу">
          <div className="session-day-options">
            <button
              className={`session-day-button choose-date ${(selectedDateType === 'specific' && chosenSpecificDate) || isDatePickerOpen ? 'selected' : ''}`}
              onClick={toggleDatePicker}
            >
              <i className="fa fa-calendar"></i> {chosenSpecificDate ? chosenSpecificDate : 'Обрати дату'}
            </button>
            <div className="session-day-buttons-row">
              <button
                className={`session-day-button ${selectedDateType === 'today' ? 'selected' : ''}`}
                onClick={() => handleQuickDateChange('today')}
              >
                Сьогодні
              </button>
              <button
                className={`session-day-button ${selectedDateType === 'tomorrow' ? 'selected' : ''}`}
                onClick={() => handleQuickDateChange('tomorrow')}
              >
                Завтра
              </button>
            </div>
          </div>
          {isDatePickerOpen && (
            <div className="date-picker-wrapper">
              <CustomDatePicker
                onDateSelect={handleSpecificDateSelect}
                initialSelectedDate={chosenSpecificDate}
                onClose={() => setIsDatePickerOpen(false)}
              />
            </div>
          )}
        </FilterCard>

        <RangeSlider
          title="Час сеансу"
          min={0}
          max={24 * 60 - 1}
          value={sessionTimeRange}
          onChange={handleSessionTimeChange}
          formatLabel={formatTimeLabel}
          step={1}
        />

        <FilterCard title="Жанр">
          <div className="filter-card__buttons-grid">
            {genres.map(genre => (
              <button
                key={uuidv4()}
                className={`filter-button ${selectedGenres.includes(genre) ? 'selected' : ''}`}
                onClick={() => handleGenreChange(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </FilterCard>

        <RangeSlider
          title="Рейтинг"
          min={0}
          max={10}
          step={0.1}
          value={ratingRange}
          onChange={handleRatingChange}
          formatLabel={formatRatingLabel}
        />
        <FilterCard title="Вік">
          <div className="filter-card__buttons-grid">
            {ageRatings.map(age => (
              <button
                key={uuidv4()}
                className={`filter-button ${selectedAgeRatings.includes(age) ? 'selected' : ''}`}
                onClick={() => handleAgeRatingChange(age)}
              >
                {age}
              </button>
            ))}
          </div>
        </FilterCard>

        <FilterCard title="Сортувати">
          <div className="sort-options-grid">
            <button className={`sort-button ${sortBy === 'newest' ? 'selected' : ''}`} onClick={() => handleSortChange('newest')}>Новіші</button>
            <button className={`sort-button ${sortBy === 'oldest' ? 'selected' : ''}`} onClick={() => handleSortChange('oldest')}>Старіші</button>
            <button className={`sort-button ${sortBy === 'title_asc' ? 'selected' : ''}`} onClick={() => handleSortChange('title_asc')}>Назвою (А-Я)</button>
            <button className={`sort-button ${sortBy === 'title_desc' ? 'selected' : ''}`} onClick={() => handleSortChange('title_desc')}>Назвою (Я-А)</button>
            <button className={`sort-button ${sortBy === 'rating_desc' ? 'selected' : ''}`} onClick={() => handleSortChange('rating_desc')}>Рейтингом (Вис.)</button>
            <button className={`sort-button ${sortBy === 'rating_asc' ? 'selected' : ''}`} onClick={() => handleSortChange('rating_asc')}>Рейтингом (Низ.)</button>
          </div>
        </FilterCard>

        <button onClick={applyFilters} className="apply-filters-button">
          Застосувати фільтри
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;