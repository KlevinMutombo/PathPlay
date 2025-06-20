// src/GamePage.js
import React, { useState, useEffect } from 'react';
import './gamepage.css';

function GamePage({ difficulty = 'easy', theme = 'numbers', onBack }) {
  const gridSize = 5;
  const maxTiles = 10;
  const revealTimings = { easy: 1500, medium: 1000, hard: 250 };
  const delay = revealTimings[difficulty] || revealTimings.easy;

  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [step, setStep] = useState('reveal');       // 'reveal' | 'play' | 'won' | 'lost'
  const [revealIndex, setRevealIndex] = useState(-1);
  const [userClicks, setUserClicks] = useState([]);
  const [wrongIndex, setWrongIndex] = useState(null);

  const generateSequence = (len) => {
    const seq = [];
    const used = new Set();
    while (seq.length < len) {
      const idx = Math.floor(Math.random() * gridSize * gridSize);
      if (!used.has(idx)) {
        used.add(idx);
        seq.push(idx);
      }
    }
    return seq;
  };

  const startLevel = () => {
    const count = Math.min(level, maxTiles);
    const seq = generateSequence(count);
    setSequence(seq);
    setUserClicks([]);
    setWrongIndex(null);
    setStep('reveal');
    setRevealIndex(0);

    seq.forEach((_, i) => {
      setTimeout(() => setRevealIndex(i), delay * i);
    });
    setTimeout(() => {
      setRevealIndex(-1);
      setStep('play');
    }, delay * seq.length + 200);
  };

  useEffect(() => {
    startLevel();
  }, [level]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (idx) => {
    if (step !== 'play') return;

    if (sequence.includes(idx)) {
      setUserClicks((prev) => [...prev, idx]);
      if (userClicks.length + 1 === sequence.length) {
        setStep('won');
      }
    } else {
      setWrongIndex(idx);
      setStep('lost');
    }
  };

  const nextLevel = () => {
    setLevel((l) => Math.min(l + 1, maxTiles));
  };

  
  const retry = () => {
    if (level === 1) {
      startLevel();
    } else {
      setLevel(1);
    }
  };

  // Content for each cell
  const numberContent = (i) => i + 1;
  const shapeEmojis = ['🔺','🔴','⬛️','🔶'];
  const animalEmojis = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯'];
  const getContent = (i) => {
    if (theme === 'numbers') return numberContent(i);
    if (theme === 'shapes')  return shapeEmojis[i % shapeEmojis.length];
    if (theme === 'animals') return animalEmojis[i % animalEmojis.length];
    return '';
  };

  return (
    <div className={`gamepage theme-${theme}`}>  
      <header className="game-header">
        <h1>PathPlay</h1>
        
      </header>

      <div className="status">
        <h2>Level {level}</h2>
        <p>Difficulty: {difficulty}</p>
        {step === 'reveal' && <p>Memorise the highlighted tiles</p>}
        {step === 'play'   && <p>Click all the correct tiles</p>}
        {step === 'won'    && <p>Nice! You can proceed to the next level</p>}
        {step === 'lost'   && <p>Oops! You picked the wrong path!</p>}
      </div>

      <div className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 50px)` }}>
        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
          const isRevealed     = step === 'reveal' && sequence[revealIndex] === i;
          const isCorrectClick = userClicks.includes(i);
          const isWrongClick   = step === 'lost' && wrongIndex === i;
          return (
            <div
              key={i}
              className={
                `cell` +
                (isRevealed     ? ' reveal'  : '') +
                (isCorrectClick ? ' correct' : '') +
                (isWrongClick   ? ' wrong'   : '')
              }
              onClick={() => handleClick(i)}
            >
              <span className="content">{getContent(i)}</span>
            </div>
          );
        })}
      </div>

      <div className="controls">
        <button onClick={retry}>
          {step === 'lost' ? 'Try again' : 'Restart (Level 1)'}
        </button>
        {step === 'won' && (
          <button onClick={nextLevel}>Next Level</button>
        )}
        
          <button onClick={onBack}>Main Menu</button>
        
      </div>
    </div>
  );
}

export default GamePage;


