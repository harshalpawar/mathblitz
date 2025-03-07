'use client';

import React, { useState } from 'react';
import StartScreen from '../components/StartScreen';
import Game from '../components/Game';
import Score from '../components/Score';

/**
 * Main application component that manages game state and transitions between screens
 */
export default function Home() {
  // Game state management
  const [gameSettings, setGameSettings] = useState(null);
  const [finalScore, setFinalScore] = useState(null);

  /**
   * Starts a new game with the provided settings
   * @param {Object} settings - Game configuration settings
   */
  const handleStart = (settings) => {
    setGameSettings(settings);
    setFinalScore(null);
  };

  /**
   * Restarts the game with the same settings
   */
  const handleRestart = () => {
    setFinalScore(null);
    // Create a new reference to trigger re-render
    setGameSettings((prevSettings) => ({ ...prevSettings }));
  };

  /**
   * Handles game end and stores the final score
   * @param {number} score - The final score from the completed game
   */
  const handleEnd = (score) => {
    setFinalScore(score);
  };

  // Render the appropriate component based on game state
  return (
    <main>
      {gameSettings && finalScore === null ? (
        <Game settings={gameSettings} onRestart={handleRestart} onEnd={handleEnd} />
      ) : finalScore !== null ? (
        <Score finalScore={finalScore} onRestart={handleRestart} />
      ) : (
        <StartScreen onStart={handleStart} />
      )}
    </main>
  );
}
