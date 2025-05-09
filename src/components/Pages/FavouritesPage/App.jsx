import { useState } from 'react';
import './App.css';

function App() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const toggleActive = (event) => {
    const parent = event.currentTarget.parentElement.parentElement;
    const items = parent.querySelectorAll('.category-item, .genre-item, .age-item, .sorting-item');
    
    items.forEach(item => {
      item.classList.remove('active');
    });
    
    event.currentTarget.classList.add('active');
    console.log("Обрано: ", event.currentTarget.textContent);
  };

  
}

export default App;