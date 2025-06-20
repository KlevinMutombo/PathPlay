// src/GamePage.js
import React, { useState, useEffect } from 'react';
import './gamepage.css';

function GamePage({ difficulty = 'easy', theme = 'numbers', onBack }) {
  // Taille de la grille (5x5 ici)
  const gridSize = 5;
  // Nombre maximum de tuiles à révéler
  const maxTiles = 10;
  // Durées de révélation selon la difficulté (en ms)
  const revealTimings = { easy: 1500, medium: 1000, hard: 250 };
  // Détermine le délai à utiliser, fallback sur 'easy' si difficulté inconnue
  const delay = revealTimings[difficulty] || revealTimings.easy;

  // Niveau actuel, démarre à 1
  const [level, setLevel] = useState(1);
  // Séquence d'indices de tuiles à mémoriser pour ce niveau
  const [sequence, setSequence] = useState([]);
  // Étape du jeu : 'reveal', 'play', 'won', 'lost'
  const [step, setStep] = useState('reveal');
  // Index courant lors de la phase de révélation
  const [revealIndex, setRevealIndex] = useState(-1);
  // Indices sur lesquels l'utilisateur a cliqué correctement
  const [userClicks, setUserClicks] = useState([]);
  // En cas de mauvais clic, on stocke l'indice erroné
  const [wrongIndex, setWrongIndex] = useState(null);

  // Génère une séquence unique d'indices de longueur len, sans répétition
  const generateSequence = (len) => {
    const seq = [];
    const used = new Set();
    while (seq.length < len) {
      // Indice aléatoire dans la grille (0 à gridSize*gridSize - 1)
      const idx = Math.floor(Math.random() * gridSize * gridSize);
      if (!used.has(idx)) {
        used.add(idx);
        seq.push(idx);
      }
    }
    return seq;
  };

  // Démarre ou redémarre le niveau courant
  const startLevel = () => {
    // nombre de tuiles à révéler = min(level, maxTiles)
    const count = Math.min(level, maxTiles);
    const seq = generateSequence(count);
    setSequence(seq);
    setUserClicks([]);    // on réinitialise les clics de l'utilisateur
    setWrongIndex(null);  // pas d'erreur initialement
    setStep('reveal');    // on passe à l'étape de révélation
    setRevealIndex(0);    // on commence la révélation au premier élément

    // Boucle pour révéler chaque tuile à intervalles réguliers
    seq.forEach((_, i) => {
      setTimeout(() => setRevealIndex(i), delay * i);
    });
    // Après avoir révélé toutes les tuiles, on masque et passe à l'étape de jeu
    setTimeout(() => {
      setRevealIndex(-1);
      setStep('play');
    }, delay * seq.length + 200);
  };

  // useEffect pour lancer startLevel à chaque changement de niveau
  useEffect(() => {
    startLevel();
    
  }, [level]);

  // Gestion du clic sur une tuile (idx)
  const handleClick = (idx) => {
    // N'accepte les clics que si on est en phase 'play'
    if (step !== 'play') return;

    // Si l'utilisateur a déjà cliqué cette tuile, on ignore
    if (userClicks.includes(idx)) {
      return;
    }

    // Si l'indice fait partie de la séquence attendue
    if (sequence.includes(idx)) {
      // On ajoute ce clic correct
      setUserClicks((prev) => {
        const newClicks = [...prev, idx];
        // Si après ce clic, on a cliqué sur toutes les tuiles de la séquence -> gagné
        if (newClicks.length === sequence.length) {
          setStep('won');
        }
        return newClicks;
      });
    } else {
      // Clic incorrect : on stocke l'indice et passe à l'état 'lost'
      setWrongIndex(idx);
      setStep('lost');
    }
  };

  // Passe au niveau suivant (niveau non borné, seulement la séquence reste limitée)
  const nextLevel = () => {
    setLevel((l) => l + 1);
  };

  // Retry / redémarrage
  const retry = () => {
    if (level === 1) {
      // Si on est déjà au niveau 1, on redémarre simplement la séquence
      startLevel();
    } else {
      // Sinon, on réinitialise au niveau 1 (ce qui déclenchera startLevel via useEffect)
      setLevel(1);
    }
  };

  // Contenu affiché dans chaque case selon le thème
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
      {/* En-tête */}
      <header className="game-header">
        <h1>PathPlay</h1>
      </header>

      {/* Statut et instructions */}
      <div className="status">
        <h2>Level {level}</h2>
        <p>Difficulty: {difficulty}</p>
        {step === 'reveal' && <p>Memorise the highlighted tiles</p>}
        {step === 'play'   && <p>Click all the correct tiles</p>}
        {step === 'won'    && <p>Nice! You can proceed to the next level</p>}
        {step === 'lost'   && <p>Oops! You picked the wrong path!</p>}
      </div>

      {/* Grille de tuiles */}
      <div className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 50px)` }}>
        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
          // Détermine si la tuile est en cours de révélation
          const isRevealed     = step === 'reveal' && sequence[revealIndex] === i;
          // Si l'utilisateur a cliqué correctement sur cette tuile
          const isCorrectClick = userClicks.includes(i);
          // Si c'est le clic erroné après une perte
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

      {/* Boutons de contrôle */}
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




