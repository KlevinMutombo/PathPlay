// src/Menu.js
import React, { useState } from 'react';
import './menu.css';

function Menu({ onStart }) {
  const [difficulty, setDifficulty] = useState('easy');
  const [theme, setTheme] = useState('nature');

  return (
    <div className="menu">
      <h1 className="menu-title">PathPlay</h1>
      <div className="menu-content">
        <div className="menu-section">
          <h2>Choose your difficulty.</h2>
          <button className={`easy ${difficulty==='easy' ? 'selected' : ''}`} onClick={() => setDifficulty('easy')}>Easy 😊</button>
          <button className={`medium ${difficulty==='medium' ? 'selected' : ''}`} onClick={() => setDifficulty('medium')}>Medium 😐</button>
          <button className={`hard ${difficulty==='hard' ? 'selected' : ''}`} onClick={() => setDifficulty('hard')}>Hard 😠</button>
        </div>

        <div className="menu-section">
          <h2>Choose your theme.</h2>
          <button className={`theme-btn ${theme==='numbers' ? 'selected' : ''}`} onClick={() => setTheme('numbers')}>Numbers 🔢</button>
          <button className={`theme-btn ${theme==='shapes' ? 'selected' : ''}`} onClick={() => setTheme('shapes')}>Shapes 🔴🟥🔺</button>
          <button className={`theme-btn ${theme==='animals' ? 'selected' : ''}`} onClick={() => setTheme('animals')}>Animals 🐾</button>
        </div>

        <div className="menu-section">
          <h2>Start your challenge.</h2>
          <button className="play-btn" onClick={() => onStart(difficulty, theme)}>Play now!</button>
        </div>
      </div>
    </div>
  );
}

export default Menu;