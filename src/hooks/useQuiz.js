// src/hooks/useQuiz.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../services/triviaAPI';

const useQuiz = () => {
  const navigate = useNavigate();
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
  
  // Create a ref for handleAnswer to avoid dependency issues
  const handleAnswerRef = useRef();

  // Initialize quiz
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setLoading(true);
        const fetchedQuestions = await fetchQuestions(10, difficulty);
        setQuestions(fetchedQuestions);
        setUserAnswers(new Array(fetchedQuestions.length).fill(null));
        setScore(0);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setTimerActive(true);
      } catch (err) {
        setError('Failed to load questions. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initializeQuiz();
  }, [difficulty]);

  // Memoize handleAnswer with useCallback
  const handleAnswer = useCallback((answerIndex) => {
    setSelectedOption(answerIndex);
    
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newUserAnswers);
    
    if (answerIndex !== null) {
      const selectedOptionText = questions[currentQuestionIndex].options[answerIndex];
      const correctAnswerText = questions[currentQuestionIndex].correctAnswer;
      if (selectedOptionText === correctAnswerText) {
        setScore(prevScore => prevScore + 1);
      }
    }
    
    setTimeLeft(30);
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedOption(null);
      } else {
        setTimerActive(false);
        setTimeout(() => {
          navigate('/results');
        }, 100);
      }
    }, 500);
  }, [currentQuestionIndex, userAnswers, questions, navigate]);

  // Update the ref whenever handleAnswer changes
  useEffect(() => {
    handleAnswerRef.current = handleAnswer;
  }, [handleAnswer]);

  // Timer effect - now uses the ref instead of direct function
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

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setSelectedOption(null);
    setTimeLeft(30);
    setTimerActive(true);
    navigate('/');
  };

  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  return {
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
    handleAnswer,
    restartQuiz,
    changeDifficulty
  };
};

export default useQuiz;