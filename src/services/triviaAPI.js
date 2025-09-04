// src/services/triviaAPI.js
import questionsData from '../data/questions.json';

// Set to true to use local questions only
const USE_LOCAL_QUESTIONS_ONLY = true;

export const fetchQuestions = async (amount = 10, difficulty = 'medium') => {
  // If flag is set, use local questions only
  if (USE_LOCAL_QUESTIONS_ONLY) {
    console.log(`Using local questions for ${difficulty} difficulty`);
    const questions = questionsData[difficulty] || [];
    return shuffleArray(questions.slice(0, Math.min(amount, questions.length)));
  }
  
  try {
    console.log("Fetching questions from API...");
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`
    );
    
    if (!response.ok) {
      console.log("API request failed, using fallback questions");
      return getFallbackQuestions(amount, difficulty);
    }
    
    const data = await response.json();
    
    if (data.response_code !== 0) {
      console.log("API returned error code, using fallback questions");
      return getFallbackQuestions(amount, difficulty);
    }
    
    console.log("Successfully fetched questions from API");
    // Normalize the data to our UI model
    return data.results.map((question) => ({
      question: decodeHTMLEntities(question.question),
      options: shuffleArray([
        ...question.incorrect_answers.map(decodeHTMLEntities),
        decodeHTMLEntities(question.correct_answer)
      ]),
      correctAnswer: decodeHTMLEntities(question.correct_answer)
    }));
  } catch (error) {
    console.error('Error fetching questions:', error);
    console.log("Using fallback questions");
    return getFallbackQuestions(amount, difficulty);
  }
};

// Fallback to local questions
const getFallbackQuestions = (amount, difficulty) => {
  console.log(`Using fallback questions for ${difficulty} difficulty`);
  const questions = questionsData[difficulty] || [];
  return shuffleArray(questions.slice(0, Math.min(amount, questions.length)));
};

// Helper function to decode HTML entities
const decodeHTMLEntities = (text) => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

// Helper function to shuffle array
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};