// src/context/QuizContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../services/triviaAPI';

const QuizContext = createContext();

export const useQuizContext = () => useContext(QuizContext);

export const QuizProvider = ({ children }) => {
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
        console.log("Fetched questions:", fetchedQuestions);
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
    console.log("handleAnswer called with:", answerIndex);
    console.log("Current question index:", currentQuestionIndex);
    console.log("Current userAnswers before update:", userAnswers);
    
    // Update the selected option immediately
    setSelectedOption(answerIndex);
    
    // Create a new array with the updated answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answerIndex;
    console.log("New userAnswers after update:", newUserAnswers);
    setUserAnswers(newUserAnswers);
    
    // Check if answer is correct and update score
    if (answerIndex !== null) {
      const selectedOptionText = questions[currentQuestionIndex].options[answerIndex];
      const correctAnswerText = questions[currentQuestionIndex].correctAnswer;
      console.log("Selected option:", selectedOptionText);
      console.log("Correct answer:", correctAnswerText);
      if (selectedOptionText === correctAnswerText) {
        console.log("Answer is correct, updating score");
        setScore(prevScore => {
          const newScore = prevScore + 1;
          console.log("New score:", newScore);
          return newScore;
        });
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
        console.log("Quiz finished, navigating to results");
        setTimerActive(false);
        // Make sure we save the final state before navigating
        setTimeout(() => {
          console.log("Final userAnswers:", userAnswers);
          console.log("Final score:", score);
          navigate('/results');
        }, 100);
      }
    }, 500);
  };

  const restartQuiz = () => {
    console.log("Restarting quiz");
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setSelectedOption(null);
    setTimeLeft(30);
    setTimerActive(true);
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