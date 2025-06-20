// src/App.js
import React, { useState } from 'react';
import './index.css';
import './App.css';
import Menu from './menu';
import GamePage from './gamepage';

function App() {
  const [showGame, setShowGame] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [theme, setTheme] = useState('nature');

  // Launches the game with selected settings
  const handleStartGame = (selectedDifficulty, selectedTheme) => {
    setDifficulty(selectedDifficulty);
    setTheme(selectedTheme);
    setShowGame(true);
  };

  // Returns to main menu
  const handleBackToMenu = () => {
    setShowGame(false);
  };

  return (
    <div className="App">
      {!showGame ? (
        <Menu onStart={handleStartGame} />
      ) : (
        <GamePage
          difficulty={difficulty}
          theme={theme}
          onBack={handleBackToMenu}
        />
      )}
    </div>
  );
}

export default App;
