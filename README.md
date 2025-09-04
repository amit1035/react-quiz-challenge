# React Quiz Challenge

A responsive quiz application built with React that tests users on React and JavaScript concepts.

## Features

- **Difficulty Levels**: Easy, Medium, and Hard with different question sets
- **Timed Questions**: 30-second timer per question
- **Progress Tracking**: Visual progress bar and question counter
- **Score Tracking**: Real-time score calculation and high score persistence
- **Results Page**: Detailed answer summary with correct/incorrect indicators
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: Keyboard navigation and ARIA labels

## Technical Stack

- **Frontend**: React 18, React Router DOM
- **State Management**: React Hooks (useState, useEffect) and React Context API
- **Styling**: CSS with CSS Variables for theming
- **Data**: Open Trivia DB API with fallback to local JSON
- **Deployment**: Netlify

## Project Structure
react-quiz-challenge/
├── public/
│ ├── index.html
│ └── _redirects
├── src/
│ ├── components/
│ │ ├── Quiz.js
│ │ ├── Question.js
│ │ ├── Results.js
│ │ ├── Timer.js
│ │ ├── ProgressBar.js
│ │ └── DifficultySelector.js
│ ├── context/
│ │ └── QuizContext.js
│ ├── hooks/
│ │ └── useQuiz.js
│ ├── services/
│ │ └── triviaAPI.js
│ ├── data/
│ │ └── questions.json
│ ├── styles/
│ │ └── global.css
│ ├── App.js
│ └── index.js
├── package.json
└── README.md

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amit1035/react-quiz-challenge.git
   cd react-quiz-challenge
2. Install dependencies: npm install
3. Start the development server: npm start

Open your browser and navigate to http://localhost:3000.
How to Use
Select a difficulty level (Easy, Medium, or Hard)
Answer each multiple-choice question within the 30-second time limit
View your results after completing all questions
See your score, percentage, and detailed answer breakdown
Restart the quiz to try again or change difficulty
Challenges and Solutions
API Rate Limiting: Implemented fallback to local JSON questions when the Open Trivia DB API returns rate limit errors.
State Management: Used React Context API to maintain state across components and ensure proper score tracking.
React Hook Dependencies: Resolved dependency issues in useEffect and useCallback hooks using refs to avoid unnecessary re-renders.
Responsive Design: Created a mobile-first design with CSS Grid and Flexbox for optimal viewing on all devices.
Routing on Static Hosting: Added _redirects file for proper React Router functionality on Netlify.

Live Demo
Check out the live application: https://thequizcraft.netlify.app/

Future Enhancements
Add more question categories
Implement user accounts for score tracking across sessions
Add sound effects and animations
Create a leaderboard system
Implement dark mode
Add more difficulty levels
License
This project is licensed under the MIT License.


This README file provides a comprehensive overview of your React Quiz App project, including:

1. A clear description of the project and its features
2. The technical stack used
3. A visual representation of the project structure
4. Step-by-step installation and usage instructions
5. Documentation of challenges faced and solutions implemented
6. A link to the live demo
7. Future enhancement ideas

This README will help reviewers understand your project at a glance and appreciate the technical decisions you made during development.

