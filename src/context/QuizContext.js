// src/context/QuizContext.js
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../services/triviaAPI';
import { useGlobalState } from '../GlobalState';

const QuizContext = createContext();
export const useQuizContext = () => useContext(QuizContext);

export const QuizProvider = ({ children }) => {
  const navigate = useNavigate();
  const { saveQuizResults } = useGlobalState();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // Create a ref to store the latest handleAnswer function
  const handleAnswerRef = useRef();

  // Initialize quiz
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setLoading(true);
        const fetchedQuestions = await fetchQuestions(10, difficulty);
        console.log("Fetched questions:", fetchedQuestions);
        setQuestions(fetchedQuestions);
        // Initialize userAnswers with null values
        const initialAnswers = new Array(fetchedQuestions.length).fill(null);
        setUserAnswers(initialAnswers);
        setScore(0);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setTimerActive(true);
        setQuizCompleted(false);
      } catch (err) {
        setError('Failed to load questions. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initializeQuiz();
  }, [difficulty]);

  // Timer effect - using ref instead of direct function dependency
  useEffect(() => {
    let timer;
    
    if (timerActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timerActive && timeLeft === 0) {
      // Time's up, lock in no answer and move to next question
      handleAnswerRef.current(null);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timerActive, timeLeft]); // No handleAnswer dependency needed

  // Define handleAnswer function
  const handleAnswer = useCallback((answerIndex) => {
    console.log("handleAnswer called with:", answerIndex);
    console.log("Current question index:", currentQuestionIndex);
    console.log("Current userAnswers before update:", userAnswers);
    
    // Update the selected option immediately
    setSelectedOption(answerIndex);
    
    // Create a new array with the updated answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answerIndex;
    console.log("Updated userAnswers:", newUserAnswers);
    
    // Update the userAnswers state
    setUserAnswers(newUserAnswers);
    
    // Check if answer is correct and update score
    let newScore = score;
    if (answerIndex !== null) {
      const selectedOptionText = questions[currentQuestionIndex]?.options[answerIndex];
      const correctAnswerText = questions[currentQuestionIndex]?.correctAnswer;
      console.log("Selected option:", selectedOptionText);
      console.log("Correct answer:", correctAnswerText);
      if (selectedOptionText === correctAnswerText) {
        console.log("Answer is correct, updating score");
        newScore = score + 1;
        setScore(newScore);
      } else {
        console.log("Answer is incorrect");
      }
    } else {
      console.log("No answer selected");
    }
    
    // Reset timer for next question
    setTimeLeft(30);
    
    // Move to next question or finish quiz after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        console.log("Moving to next question");
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedOption(null); // Reset selected option for next question
      } else {
        // Quiz finished
        console.log("Quiz finished, setting completed flag");
        setTimerActive(false);
        setQuizCompleted(true);
        
        // Prepare results object
        const results = {
          userAnswers: newUserAnswers,
          score: newScore,
          questions: questions
        };
        console.log("Quiz results:", results);
        
        // Save results to global state
        saveQuizResults(results);
        
        // Navigate to results page
        setTimeout(() => {
          console.log("Navigating to results");
          navigate('/results');
        }, 100);
      }
    }, 500);
  }, [currentQuestionIndex, userAnswers, questions, navigate, score, saveQuizResults]);

  // Update the ref whenever handleAnswer changes
  useEffect(() => {
    handleAnswerRef.current = handleAnswer;
  }, [handleAnswer]);

  const restartQuiz = () => {
    console.log("Restarting quiz");
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setSelectedOption(null);
    setTimeLeft(30);
    setTimerActive(true);
    setQuizCompleted(false);
    navigate('/');
  };

  const changeDifficulty = (newDifficulty) => {
    console.log("Changing difficulty to:", newDifficulty);
    setDifficulty(newDifficulty);
    // The rest will be handled by the initializeQuiz effect
  };

  const value = {
    questions,
    currentQuestionIndex,
    userAnswers,
    score,
    loading,
    error,
    difficulty,
    timeLeft,
    timerActive,
    selectedOption,
    quizCompleted,
    handleAnswer,
    restartQuiz,
    changeDifficulty
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};