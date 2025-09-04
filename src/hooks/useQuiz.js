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
  const [selectedOption, setSelectedOption] = useState(null);

  // Initialize quiz
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setLoading(true);
        const fetchedQuestions = await fetchQuestions(10, difficulty);
        setQuestions(fetchedQuestions);
        // Initialize userAnswers with null values
        const initialAnswers = new Array(fetchedQuestions.length).fill(null);
        setUserAnswers(initialAnswers);
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
    // Update the selected option immediately
    setSelectedOption(answerIndex);
    
    // Create a new array with the updated answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newUserAnswers);
    
    // Check if answer is correct and update score
    if (answerIndex !== null) {
      const selectedOptionText = questions[currentQuestionIndex].options[answerIndex];
      const correctAnswerText = questions[currentQuestionIndex].correctAnswer;
      if (selectedOptionText === correctAnswerText) {
        setScore(prevScore => prevScore + 1);
      }
    }
    
    // Reset timer for next question
    setTimeLeft(30);
    
    // Move to next question or finish quiz after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedOption(null); // Reset selected option for next question
      } else {
        // Quiz finished
        setTimerActive(false);
        // Make sure we save the final state before navigating
        setTimeout(() => {
          navigate('/results');
        }, 100);
      }
    }, 500);
  };

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
    // The rest will be handled by the initializeQuiz effect
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