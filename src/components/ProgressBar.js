// src/components/ProgressBar.js
import React from 'react';

const ProgressBar = ({ current, total }) => {
  const progress = (current / total) * 100;
  
  return (
    <div className="progress-bar">
      <div className="progress-info">
        <span>Progress</span>
        <span>{current}/{total}</span>
      </div>
      <div className="progress-track">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;