// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import Quiz from './components/Quiz';
import Results from './components/Results';
import './styles/global.css';

function App() {
  return (
    <Router>
      <QuizProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </div>
      </QuizProvider>
    </Router>
  );
}

export default App;