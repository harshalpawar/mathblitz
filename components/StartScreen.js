'use client';

import React, { useState } from 'react';

/**
 * StartScreen component for configuring and starting the game
 * @param {Function} onStart - Function to start the game with the selected settings
 */
export default function StartScreen({ onStart }) {
  // Default game settings
  const [settings, setSettings] = useState({
    addition: { enabled: true, min: 2, max: 100 },
    subtraction: { enabled: true, min: 2, max: 100 },
    multiplication: { enabled: true, min: 2, max: 12 },
    division: { enabled: true, min: 2, max: 12 },
    timer: 1,
  });

  /**
   * Handles changes to the min and max values for each operation
   * @param {string} type - The operation type (addition, subtraction, etc.)
   * @param {string} field - The field to update (min or max)
   * @param {number} value - The new value
   */
  const handleChange = (type, field, value) => {
    // Ensure value is a positive number
    const newValue = Math.max(1, value || 1);
    
    setSettings((prev) => {
      const updatedSettings = {
        ...prev,
        [type]: {
          ...prev[type],
          [field]: newValue,
        },
      };
      
      // Ensure min is not greater than max
      if (field === 'min' && newValue > updatedSettings[type].max) {
        updatedSettings[type].max = newValue;
      } else if (field === 'max' && newValue < updatedSettings[type].min) {
        updatedSettings[type].min = newValue;
      }
      
      return updatedSettings;
    });
  };

  /**
   * Toggles the enabled state of an operation
   * @param {string} type - The operation type to toggle
   */
  const handleCheckboxChange = (type) => {
    setSettings((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        enabled: !prev[type].enabled,
      },
    }));
  };

  /**
   * Validates settings and starts the game
   */
  const handleStart = () => {
    // Ensure at least one operation is enabled
    const hasEnabledOperation = Object.keys(settings)
      .filter(key => key !== 'timer')
      .some(key => settings[key].enabled);
    
    if (!hasEnabledOperation) {
      alert('Please enable at least one operation to start the game.');
      return;
    }
    
    onStart(settings);
  };

  // Operation types to display in the settings form
  const operationTypes = ['addition', 'subtraction', 'multiplication', 'division'];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 font-mono p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
        <h1 className="text-3xl font-bold mb-4 text-center">⚡mathblitz</h1>
        <p className="mb-6 text-center">solve as many math problems as possible within the time limit.</p>
        
        {operationTypes.map((type) => (
          <div key={type} className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={settings[type].enabled}
              onChange={() => handleCheckboxChange(type)}
              className="mr-2 w-6 h-6"
              aria-label={`Enable ${type}`}
            />
            <label className="mr-2 lowercase">{type}</label>
            <input
              type="number"
              value={settings[type].min}
              onChange={(e) => handleChange(type, 'min', parseInt(e.target.value))}
              className="w-24 px-2 py-1 mr-2 rounded-md bg-gray-700 text-white"
              min="1"
              aria-label={`Minimum value for ${type}`}
            />
            <span className="mr-2">to</span>
            <input
              type="number"
              value={settings[type].max}
              onChange={(e) => handleChange(type, 'max', parseInt(e.target.value))}
              className="w-24 px-2 py-1 rounded-md bg-gray-700 text-white"
              min="1"
              aria-label={`Maximum value for ${type}`}
            />
          </div>
        ))}

        <div className="flex items-center mb-6">
          <label className="mr-2">timer:</label>
          <select
            value={settings.timer}
            onChange={(e) => setSettings({ ...settings, timer: parseInt(e.target.value) })}
            className="border p-1 rounded bg-gray-700 text-gray-200"
            aria-label="Game duration in minutes"
          >
            {[1, 2, 3, 4, 5].map((min) => (
              <option key={min} value={min}>
                {min} min
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={handleStart} 
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition duration-200"
          aria-label="Start game"
        >
          start
        </button>
      </div>
    </div>
  );
}