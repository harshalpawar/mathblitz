'use client';

import React from 'react';

/**
 * Score component that displays the final score and provides options to restart or return to home
 * @param {number} finalScore - The final score achieved in the game
 * @param {Function} onRestart - Function to restart the game
 */
export default function Score({ finalScore, onRestart }) {
  /**
   * Navigates back to the home page
   */
  const handleReturnHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 font-mono">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">game over</h1>
        <p className="mb-6 text-center text-2xl">your final score is: <span className="font-bold">{finalScore}</span></p>
        <button 
          onClick={onRestart} 
          className="bg-blue-500 text-white p-2 rounded w-full mb-4 hover:bg-blue-600 transition duration-200"
          aria-label="Try again with the same settings"
        >
          try again
        </button>
        <button 
          onClick={handleReturnHome} 
          className="bg-gray-500 text-white p-2 rounded w-full hover:bg-gray-600 transition duration-200"
          aria-label="Return to home page"
        >
          return to home
        </button>
      </div>
    </div>
  );
}