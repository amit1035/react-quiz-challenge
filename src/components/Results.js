// src/components/Results.js
import React, { useEffect } from 'react';
import { useQuizContext } from '../context/QuizContext';

const Results = () => {
  const {
    questions,
    userAnswers,
    score,
    restartQuiz
  } = useQuizContext();
  
  // Debug: Log the userAnswers and score to see what's happening
  useEffect(() => {
    console.log("Results component - User Answers:", userAnswers);
    console.log("Results component - Score:", score);
  }, [userAnswers, score]);
  
  // Save high score to localStorage
  useEffect(() => {
    const highScore = localStorage.getItem('quizHighScore');
    if (!highScore || score > parseInt(highScore)) {
      localStorage.setItem('quizHighScore', score.toString());
    }
  }, [score]);
  
  const getHighScore = () => {
    return localStorage.getItem('quizHighScore') || 0;
  };
  
  const getAnswerStatus = (questionIndex) => {
    const userAnswer = userAnswers[questionIndex];
    console.log(`Question ${questionIndex}: userAnswer =`, userAnswer);
    if (userAnswer === null || userAnswer === undefined) return 'unanswered';
    
    const correctAnswer = questions[questionIndex].correctAnswer;
    const userSelectedOption = questions[questionIndex].options[userAnswer];
    console.log(`Question ${questionIndex}: userSelectedOption =`, userSelectedOption);
    console.log(`Question ${questionIndex}: correctAnswer =`, correctAnswer);
    
    return userSelectedOption === correctAnswer ? 'correct' : 'incorrect';
  };
  
  const handleRestart = () => {
    restartQuiz();
  };
  
  // Calculate percentage for better score display
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  
  // Get message based on score
  const getScoreMessage = () => {
    if (percentage === 100) return "Perfect! 🎉";
    if (percentage >= 80) return "Excellent! 👏";
    if (percentage >= 60) return "Good job! 👍";
    if (percentage >= 40) return "Keep trying! 💪";
    return "Better luck next time! 📚";
  };
  
  if (!questions.length) {
    return (
      <div className="results-container loading">
        <div className="loader"></div>
        <p>Loading results...</p>
      </div>
    );
  }
  
  // Calculate statistics
  const correctCount = score;
  const incorrectCount = userAnswers.filter(answer => answer !== null && answer !== undefined).length - score;
  const unansweredCount = userAnswers.filter(answer => answer === null || answer === undefined).length;
  
  console.log("Statistics:", { correctCount, incorrectCount, unansweredCount });
  
  return (
    <div className="results-container">
      <header className="results-header">
        <h1>Quiz Results</h1>
        
        <div className="score-display">
          <div className="score-circle">
            {/* Updated to use score-row for horizontal layout */}
            <div className="score-row">
              <span className="score-number">{score}</span>
              <span className="score-total">/{questions.length}</span>
            </div>
          </div>
          <div className="score-text">
            <h2>{getScoreMessage()}</h2>
            <div className="score-details">
              <p>Score: {percentage}%</p>
              <p>High Score: {getHighScore()}/{questions.length}</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="results-main">
        <h2>Answer Summary</h2>
        <div className="results-stats">
          <div className="stat-item correct">
            <span className="stat-number">{correctCount}</span>
            <span className="stat-label">Correct</span>
          </div>
          <div className="stat-item incorrect">
            <span className="stat-number">{incorrectCount}</span>
            <span className="stat-label">Incorrect</span>
          </div>
          <div className="stat-item unanswered">
            <span className="stat-number">{unansweredCount}</span>
            <span className="stat-label">Unanswered</span>
          </div>
        </div>
        
        <div className="results-list">
          {questions.map((question, index) => {
            const status = getAnswerStatus(index);
            const userAnswer = userAnswers[index];
            const userSelectedOption = userAnswer !== null && userAnswer !== undefined ? question.options[userAnswer] : null;
            
            return (
              <div 
                key={index} 
                className={`result-item ${status}`}
              >
                <div className="result-header">
                  <span className="result-number">Question {index + 1}</span>
                  <span className={`result-status ${status}`}>
                    {status === 'correct' ? '✓ Correct' : 
                     status === 'incorrect' ? '✗ Incorrect' : 
                     '— Unanswered'}
                  </span>
                </div>
                
                <div className="result-question">{question.question}</div>
                
                <div className="result-answers">
                  <div className="correct-answer">
                    <span className="answer-label">Correct Answer:</span>
                    <span className="answer-text">{question.correctAnswer}</span>
                  </div>
                  
                  {userSelectedOption && (
                    <div className="user-answer">
                      <span className="answer-label">Your Answer:</span>
                      <span className="answer-text">{userSelectedOption}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      
      <div className="results-actions">
        <button className="restart-button" onClick={handleRestart}>
          Restart Quiz
        </button>
      </div>
    </div>
  );
};

export default Results;