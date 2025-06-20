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

  // Commence le jeux avec parametres selectionnes 
  const handleStartGame = (selectedDifficulty, selectedTheme) => {
    setDifficulty(selectedDifficulty);
    setTheme(selectedTheme);
    setShowGame(true);
  };

  // Retourne au menu
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
