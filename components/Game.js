'use client';

import React, { useState, useEffect, useRef } from 'react';
import Score from './Score';

/**
 * Game component responsible for displaying and managing the math problem game
 * @param {Object} settings - Configuration for game operations and timer
 * @param {Function} onRestart - Function to restart the game
 * @param {Function} onEnd - Function to handle game end with final score
 */
export default function Game({ settings, onRestart, onEnd }) {
  // Game state
  const [problem, setProblem] = useState({});
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(settings.timer * 60);
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef(null);

  // Generate initial problem when component mounts
  useEffect(() => {
    generateProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer management
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setGameOver(true);
      onEnd(score);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // Focus on input field when problem changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [problem]);

  /**
   * Generates a new math problem based on selected operations in settings
   */
  const generateProblem = () => {
    // Get enabled operations from settings
    const operations = Object.keys(settings).filter((key) => 
      settings[key].enabled && key !== 'timer'
    );
    
    // If no operations are enabled, return a default addition problem
    if (operations.length === 0) {
      setProblem({ 
        question: "No operations enabled. Please restart.", 
        answer: null 
      });
      return;
    }
    
    // Select a random operation from enabled options
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const min = settings[operation].min;
    const max = settings[operation].max;
    
    // Generate numbers within the specified range
    let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let num2 = Math.floor(Math.random() * (max - min + 1)) + min;

    let newProblem;
    switch (operation) {
      case 'addition':
        newProblem = { question: `${num1} + ${num2}`, answer: num1 + num2 };
        break;
      case 'subtraction':
        // Ensure the result is non-negative by swapping if needed
        if (num1 < num2) [num1, num2] = [num2, num1];
        newProblem = { question: `${num1} - ${num2}`, answer: num1 - num2 };
        break;
      case 'multiplication':
        newProblem = { question: `${num1} * ${num2}`, answer: num1 * num2 };
        break;
      case 'division':
        // Ensure clean division by making num1 a multiple of num2
        const product = num1 * num2;
        // Ensure product doesn't exceed max
        newProblem = { 
          question: `${product} / ${num2}`, 
          answer: product / num2 
        };
        break;
      default:
        newProblem = { question: "Error: Invalid operation", answer: null };
        break;
    }
    setProblem(newProblem);
  };

  /**
   * Handles user input and checks if the answer is correct
   * @param {Event} e - Input change event
   */
  const handleAnswerChange = (e) => {
    const userInput = e.target.value;
    setAnswer(userInput);
    
    // Only check answer if input is not empty and can be parsed as a number
    if (userInput.trim() !== '') {
      const userAnswer = parseInt(userInput);
      if (!isNaN(userAnswer) && userAnswer === problem.answer) {
        setScore((prev) => prev + 1);
        setAnswer('');
        generateProblem();
      }
    }
  };

  /**
   * Ends the game manually
   */
  const handleEndGame = () => {
    setGameOver(true);
    onEnd(score);
  };

  // Render score screen if game is over
  if (gameOver) {
    return <Score finalScore={score} onRestart={onRestart} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 font-mono">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">solve the problem</h1>
        <p className="mb-6 text-center text-4xl">{problem.question}</p>
        <input
          type="tel"
          inputMode="numeric"
          value={answer}
          onChange={handleAnswerChange}
          ref={inputRef}
          className="border p-2 mb-4 rounded bg-gray-700 text-gray-200 w-full"
          aria-label="Your answer"
        />
        <p className="mb-4 text-center">score: {score}</p>
        <p className="mb-4 text-center">time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
        <button 
          onClick={handleEndGame} 
          className="bg-red-500 text-white p-2 rounded w-full hover:bg-red-600 transition duration-200"
          aria-label="End game"
        >
          end game
        </button>
      </div>
    </div>
  );
}