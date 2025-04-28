import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app-container">
      <div className="favourites-header">
        <h1>Your favourites</h1>
        <div className="controls">
          <button className="filter-btn">Filter</button>
          <button className="sort-btn">Sort</button>
        </div>
      </div>
    </div>
  );
}

export default App;