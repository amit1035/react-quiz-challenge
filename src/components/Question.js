// src/components/Question.js
import React from 'react';

const Question = ({ question, options, selectedOption, onSelectOption, disabled }) => {
  return (
    <div className="question-container">
      <h2 className="question-text">{question}</h2>
      <div className="options-container">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${selectedOption === index ? 'selected' : ''}`}
            onClick={() => onSelectOption(index)}
            disabled={disabled}
            aria-pressed={selectedOption === index}
          >
            <span className="option-letter">{String.fromCharCode(65 + index)}.</span>
            <span className="option-text">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;