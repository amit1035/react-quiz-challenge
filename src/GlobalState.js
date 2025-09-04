// src/GlobalState.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a global context
const GlobalContext = createContext();

// Create a provider component
export const GlobalProvider = ({ children }) => {
  const [quizResults, setQuizResults] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedResults = localStorage.getItem('quizResults');
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        console.log('Loaded results from localStorage:', parsedResults);
        setQuizResults(parsedResults);
      } catch (error) {
        console.error('Error parsing saved results:', error);
        localStorage.removeItem('quizResults');
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever results change
  useEffect(() => {
    if (isInitialized && quizResults) {
      console.log('Saving results to localStorage:', quizResults);
      localStorage.setItem('quizResults', JSON.stringify(quizResults));
    }
  }, [quizResults, isInitialized]);

  const saveQuizResults = (results) => {
    console.log('Saving quiz results to global state:', results);
    setQuizResults(results);
  };

  const clearQuizResults = () => {
    console.log('Clearing quiz results');
    setQuizResults(null);
    localStorage.removeItem('quizResults');
  };

  return (
    <GlobalContext.Provider value={{
      quizResults,
      saveQuizResults,
      clearQuizResults,
      isInitialized
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the global context
export const useGlobalState = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalProvider');
  }
  return context;
};