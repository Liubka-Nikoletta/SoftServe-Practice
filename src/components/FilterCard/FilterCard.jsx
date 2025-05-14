import React from 'react';
import './FilterCard.css';

const FilterCard = ({ title, children }) => {
  return (
    <div className="filter-card">
      <div className="filter-card__title">{title}</div>
      <div className="filter-card__content">{children}</div>
    </div>
  );
};

export default FilterCard;