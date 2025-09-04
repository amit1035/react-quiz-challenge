// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import { GlobalProvider } from './GlobalState'; 
import Quiz from './components/Quiz';
import Results from './components/Results';
import './styles/global.css';

function App() {
  return (
    <Router>
      <GlobalProvider>
        <QuizProvider>
          <div className="app">
            <Routes>
              <Route path="/" element={<Quiz />} />
              <Route path="/results" element={<Results />} />
            </Routes>
          </div>
        </QuizProvider>
      </GlobalProvider>
    </Router>
  );
}

export default App;