// src/components/Quiz.js
import React from 'react';
import { useQuizContext } from '../context/QuizContext';
import Question from './Question';
import Timer from './Timer';
import ProgressBar from './ProgressBar';
import DifficultySelector from './DifficultySelector';

const Quiz = () => {
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    loading,
    error,
    difficulty,
    timeLeft,
    selectedOption,
    handleAnswer,
    changeDifficulty
  } = useQuizContext();

  if (loading) {
    return (
      <div className="quiz-container loading">
        <div className="loader"></div>
        <p>Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-container empty">
        <h2>No Questions Available</h2>
        <p>Unable to load quiz questions. Please try again later.</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const hasAnswered = selectedOption !== null;

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <h1>Quiz App</h1>
        <DifficultySelector 
          currentDifficulty={difficulty} 
          onChange={changeDifficulty} 
        />
      </header>
      
      <div className="quiz-progress">
        <ProgressBar 
          current={currentQuestionIndex + 1} 
          total={questions.length} 
        />
        <Timer timeLeft={timeLeft} />
      </div>
      
      <main className="quiz-main">
        <Question
          question={currentQuestion.question}
          options={currentQuestion.options}
          selectedOption={selectedOption}
          onSelectOption={(optionIndex) => {
            if (!hasAnswered) {
              handleAnswer(optionIndex);
            }
          }}
          disabled={hasAnswered}
        />
      </main>
      
      <div className="quiz-navigation">
        <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
        <button 
          className="next-button"
          onClick={() => handleAnswer(selectedOption)}
          disabled={!hasAnswered}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;