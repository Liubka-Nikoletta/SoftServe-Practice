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
  }, [currentMinValue, currentMaxValue, title]);

  const isTimeSlider = title.toLowerCase().includes('час');
  const step = propStep !== undefined ? propStep : (isTimeSlider ? 1 : 0.1);


  useEffect(() => {
    let stateChanged = false;
    if (value[0] !== currentMinValue) {
      setCurrentMinValue(value[0]);
      stateChanged = true;
    }
    if (value[1] !== currentMaxValue) {
      setCurrentMaxValue(value[1]);
      stateChanged = true;
    }

  }, [value, currentMinValue, currentMaxValue, title]); 

  const getThumbPercent = useCallback((val) => {
    if (max === min) {
        return 0;
    }
    const percent = ((val - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, percent));
  }, [min, max, title]);

  const getValueFromPercent = useCallback((percent) => {
    let rawValue = min + (percent / 100) * (max - min);
    let steppedValue = Math.round(rawValue / step) * step;
    steppedValue = Math.max(min, Math.min(max, steppedValue));
    const finalValue = isTimeSlider ? Math.round(steppedValue) : parseFloat(steppedValue.toFixed(step.toString().includes('.') ? step.toString().split('.')[1].length : 0));
    return finalValue;
  }, [min, max, step, isTimeSlider, title]);

  const handleMouseMoveDocument = useCallback((event) => {
    if (!dragStateRef.current.type || dragStateRef.current.sliderWidth === 0) {
      if (!dragStateRef.current.type) console.warn(`[RangeSlider "${title}" handleMouseMoveDocument] No drag type set. Aborting move.`);
      if (dragStateRef.current.sliderWidth === 0) console.warn(`[RangeSlider "${title}" handleMouseMoveDocument] Slider width is 0. Aborting move.`);
      return;
    }
    event.preventDefault();

    const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
    const { type, sliderWidth, sliderLeft } = dragStateRef.current;
    const [valMinAtDragStart, valMaxAtDragStart] = internalValueRef.current;
    const mouseXOnSlider = clientX - sliderLeft;
    let newPercent = (mouseXOnSlider / sliderWidth) * 100;
    newPercent = Math.max(0, Math.min(100, newPercent)); 
    let newValueFromMouse = getValueFromPercent(newPercent);

    let newProposedMin = valMinAtDragStart;
    let newProposedMax = valMaxAtDragStart;

    if (type === 'min') {
      newProposedMin = Math.min(newValueFromMouse, valMaxAtDragStart - step); 
      newProposedMin = Math.max(min, newProposedMin);         
    } else if (type === 'max') {
      newProposedMax = Math.max(newValueFromMouse, valMinAtDragStart + step); 
      newProposedMax = Math.min(max, newProposedMax);           
    }
    if (newProposedMin !== valMinAtDragStart || newProposedMax !== valMaxAtDragStart) {
      console.log(`[RangeSlider "${title}" handleMouseMoveDocument] Values changed. Old from internalRef: [${valMinAtDragStart}, ${valMaxAtDragStart}], New Proposed: [${newProposedMin}, ${newProposedMax}]. Calling onChange.`);
      onChange([newProposedMin, newProposedMax]);
    } else {
    }
  }, [getValueFromPercent, onChange, min, max, step, title]);

  const handleMouseUpDocument = useCallback(() => {
    if (dragStateRef.current.type) {
      console.log(`[RangeSlider "${title}" handleMouseUpDocument] Mouse/Touch up. Clearing drag state. Type was: ${dragStateRef.current.type}`);
      dragStateRef.current.type = null; 
      document.removeEventListener('mousemove', handleMouseMoveDocument);
      document.removeEventListener('mouseup', handleMouseUpDocument);
      document.removeEventListener('touchmove', handleMouseMoveDocument);
      document.removeEventListener('touchend', handleMouseUpDocument);
      console.log(`[RangeSlider "${title}" handleMouseUpDocument] Document event listeners REMOVED.`);
    } else {
        // console.log(`[RangeSlider "${title}" handleMouseUpDocument] Mouse/Touch up, but no active drag type. No listeners to remove.`);
    }
  }, [handleMouseMoveDocument, title]); 

  const handleMouseDown = useCallback((thumbTypeToDrag, event) => {

    if (!sliderRef.current) {
      return;
    }

    const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
    const sliderRect = sliderRef.current.getBoundingClientRect();
    console.log(`[RangeSlider "${title}" handleMouseDown] Slider Rect: Left=${sliderRect.left.toFixed(2)}, Width=${sliderRect.width.toFixed(2)}. ClientX: ${clientX.toFixed(2)}`);

    if (sliderRect.width === 0) {
      console.warn(`[RangeSlider "${title}" handleMouseDown] WARNING: Slider width is 0. Dragging will likely not work. Ensure component is visible and layout is complete.`);
    }

    let actualThumbTypeForDrag = thumbTypeToDrag;
    if (!thumbTypeToDrag && (event.target === sliderRef.current || event.target.classList.contains('slider-track') || event.target.classList.contains('slider') )) {
        console.log(`[RangeSlider "${title}" handleMouseDown] Click on TRACK detected.`);
        const clickPercent = ((clientX - sliderRect.left) / sliderRect.width) * 100;
        const clickValue = getValueFromPercent(clickPercent);
        console.log(`[RangeSlider "${title}" handleMouseDown] Track Click Percent: ${clickPercent.toFixed(2)}%, Click Value: ${clickValue}`);

        const [currentMin, currentMax] = internalValueRef.current; 
        let newMinVal = currentMin;
        let newMaxVal = currentMax;

        if (Math.abs(clickValue - currentMin) < Math.abs(clickValue - currentMax)) {
            actualThumbTypeForDrag = 'min'; 
            newMinVal = Math.min(Math.max(clickValue, min), currentMax - step);
            newMinVal = getValueFromPercent(getThumbPercent(newMinVal)); 
        } else {
            actualThumbTypeForDrag = 'max';
            newMaxVal = Math.max(Math.min(clickValue, max), currentMin + step); 
            newMaxVal = getValueFromPercent(getThumbPercent(newMaxVal));
        }
        if (newMinVal !== currentMin || newMaxVal !== currentMax) {
            console.log(`[RangeSlider "${title}" handleMouseDown] Track click caused value change. Calling onChange with [${newMinVal}, ${newMaxVal}]`);
            onChange([newMinVal, newMaxVal]);
        }
    } else if (thumbTypeToDrag) {
        actualThumbTypeForDrag = thumbTypeToDrag;
    } else {
        return;
    }

    if (actualThumbTypeForDrag) {
        dragStateRef.current = {
            type: actualThumbTypeForDrag,
            initialMouseX: clientX,
            sliderWidth: sliderRect.width,
            sliderLeft: sliderRect.left,
        };
        document.addEventListener('mousemove', handleMouseMoveDocument);
        document.addEventListener('mouseup', handleMouseUpDocument);
        document.addEventListener('touchmove', handleMouseMoveDocument, { passive: false }); 
        document.addEventListener('touchend', handleMouseUpDocument);
    }

  }, [title, getValueFromPercent, getThumbPercent, handleMouseMoveDocument, handleMouseUpDocument, onChange, min, max, step]); 

  useEffect(() => {
    const cleanup = () => {
      if (dragStateRef.current.type) { 
        handleMouseUpDocument(); 
      }
    };
    return cleanup; 
  }, [handleMouseUpDocument, title]); 

  const minPercent = getThumbPercent(currentMinValue);
  const maxPercent = getThumbPercent(currentMaxValue);
  return (
    <FilterCard title={title}>
      <div className="range-slider-container">
        <div className="slider-labels">
          <div className="thumb-label" style={{ left: `${minPercent}%`, transform: 'translateX(-50%)' }}>
            <span className="label-background">{formatLabel(currentMinValue)}</span>
          </div>
          <div className="thumb-label" style={{ left: `${maxPercent}%`, transform: 'translateX(-50%)' }}>
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
            style={{ left: `${minPercent}%`, zIndex: dragStateRef.current.type === 'min' || (dragStateRef.current.type !== 'max' && currentMinValue <= currentMaxValue) ? 3 : 1 }}
            onMouseDown={(e) => { e.stopPropagation();  handleMouseDown('min', e); }}
            onTouchStart={(e) => { e.stopPropagation();  handleMouseDown('min', e); }}
          />
          <div
            className="slider-thumb slider-thumb-max"
            style={{ left: `${maxPercent}%`, zIndex: dragStateRef.current.type === 'max' || (dragStateRef.current.type !== 'min' && currentMaxValue > currentMinValue) ? 3 : 1 }}
            onMouseDown={(e) => { e.stopPropagation();  handleMouseDown('max', e); }}
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
        console.log("[FilterPanel useEffect loadFilterOptions] Attempting to load films from localStorage.");
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
    setSelectedGenres(prev => {
        const newSelected = prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre];
        return newSelected;
    });
  }, []);

  const handleAgeRatingChange = useCallback((age) => {
    setSelectedAgeRatings(prev => {
        const newSelected = prev.includes(age) ? prev.filter(a => a !== age) : [...prev, age];
        return newSelected;
    });
  }, []);

  const handleRatingChange = useCallback((values) => {
    console.log(`[FilterPanel] Rating range CHANGED BY SLIDER. New values: [${values[0]}, ${values[1]}]`);
    setRatingRange(values);
  }, []);

  const handleSessionTimeChange = useCallback((values) => {
    console.log(`[FilterPanel] Session time range CHANGED BY SLIDER. New values: [${values[0]}, ${values[1]}]`);
    setSessionTimeRange(values);
  }, []);

  const handleSortChange = useCallback((sortType) => {
    setSortBy(prevSortBy => {
        const newSortBy = prevSortBy === sortType ? '' : sortType;
        return newSortBy;
    });
  }, []);

  const handleQuickDateChange = useCallback((type) => { 
    console.log(`[FilterPanel] Quick date change. Type: ${type}, Current selectedDateType: ${selectedDateType}`);
    if (selectedDateType === type && type !== 'specific') { 
      console.log(`[FilterPanel] Deselecting quick date: ${type}. Clearing date selection.`);
      setSelectedDateType(null);
      setChosenSpecificDate(null);
    } else { 
      console.log(`[FilterPanel] Selecting quick date: ${type}.`);
      setSelectedDateType(type);
      setChosenSpecificDate(null); 
      setIsDatePickerOpen(false); 
    }
  }, [selectedDateType]);

  const handleSpecificDateSelect = useCallback((dateString) => {
    console.log(`[FilterPanel] Specific date selected from picker: ${dateString}`);
    setChosenSpecificDate(dateString);
    setSelectedDateType('specific');
    setIsDatePickerOpen(false); 
  }, []);

  const toggleDatePicker = () => {
    console.log(`[FilterPanel] Toggling Date Picker. Current isDatePickerOpen: ${isDatePickerOpen}, selectedDateType: ${selectedDateType}, chosenSpecificDate: ${chosenSpecificDate}`);
    setIsDatePickerOpen(prevIsOpen => {
        const newIsDatePickerOpen = !prevIsOpen;
        console.log(`[FilterPanel toggleDatePicker] Date picker will be ${newIsDatePickerOpen ? 'OPENED' : 'CLOSED'}.`);
        if (newIsDatePickerOpen) {
            if (selectedDateType === 'today' || selectedDateType === 'tomorrow' || !selectedDateType) {
                console.log(`[FilterPanel toggleDatePicker] Opening picker. Setting selectedDateType to 'specific'.`);
                setSelectedDateType('specific');
            }
        } else {
            if (!chosenSpecificDate && selectedDateType === 'specific') {
                console.log(`[FilterPanel toggleDatePicker] Closing picker, no specific date chosen, and type was 'specific'. Setting selectedDateType to null.`);
            }
        }
        return newIsDatePickerOpen;
    });
  };


  const formatTimeLabel = useCallback((minutes) => {
    const totalMinutes = Math.round(Math.min(Math.max(0, minutes), 24 * 60 - 1));
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }, []);

  const formatRatingLabel = useCallback((value) => parseFloat(value).toFixed(1), []);

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
    console.log("[FilterPanel applyFilters] Applying filters with values:", JSON.stringify(filters, null, 2));
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
                onClose={() => { console.log("[FilterPanel CustomDatePicker] onClose called from date picker component itself."); setIsDatePickerOpen(false);}}
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
