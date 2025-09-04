// src/hooks/useQuiz.js
import { useState, useEffect } from 'react';
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

  // Initialize quiz
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setLoading(true);
        const fetchedQuestions = await fetchQuestions(10, difficulty);
        setQuestions(fetchedQuestions);
        setUserAnswers(new Array(fetchedQuestions.length).fill(null));
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

  // Timer effect
  useEffect(() => {
    let timer;
    
    if (timerActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timerActive && timeLeft === 0) {
      // Time's up, lock in no answer and move to next question
      handleAnswer(null);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timerActive, timeLeft]);

  const handleAnswer = (answerIndex) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newUserAnswers);
    
    // Check if answer is correct - FIXED: Compare option text with correct answer text
    if (answerIndex !== null) {
      const selectedOptionText = questions[currentQuestionIndex].options[answerIndex];
      const correctAnswerText = questions[currentQuestionIndex].correctAnswer;
      if (selectedOptionText === correctAnswerText) {
        setScore(prevScore => prevScore + 1); // Use functional update to avoid stale state
      }
    }
    
    // Reset timer for next question
    setTimeLeft(30);
    
    // Move to next question or finish quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz finished
      setTimerActive(false);
      navigate('/results');
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setTimeLeft(30);
    setTimerActive(true);
    navigate('/');
  };

  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setTimeLeft(30);
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
    handleAnswer,
    restartQuiz,
    changeDifficulty
  };
};

export default useQuiz;