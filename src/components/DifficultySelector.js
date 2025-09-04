// src/components/DifficultySelector.js
import React from 'react';

const DifficultySelector = ({ currentDifficulty, onChange }) => {
  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  return (
    <div className="difficulty-selector">
      <span>Difficulty:</span>
      <div className="difficulty-options">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.value}
            className={`difficulty-button ${currentDifficulty === difficulty.value ? 'active ' + difficulty.value : ''}`}
            onClick={() => onChange(difficulty.value)}
            aria-pressed={currentDifficulty === difficulty.value}
          >
            {difficulty.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;