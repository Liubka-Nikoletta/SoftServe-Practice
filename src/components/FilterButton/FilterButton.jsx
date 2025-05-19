import React from 'react';
import './FilterButton.css';
import FilterIcon from './filter.png'; 

const FilterButton = ({ onClick }) => {
  return (
    <div className="frame-330" onClick={onClick}>
      <img className="majesticons-filter-line" src={FilterIcon} alt="Filter" />
    </div>
  );
};

export default FilterButton;