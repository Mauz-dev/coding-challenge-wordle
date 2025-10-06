# 🔤 Wordle Team Challenge - Starting Template

Welcome to the Wordle Team Challenge! This repository provides a **starting template** for teams to build a simplified version of Wordle in a coding event using PHP (backend) and React/TypeScript (frontend).


## 🎯 Challenge Objectives

- **Teamwork**: Practice effective collaboration, task distribution, and mutual support
- **Technical Skills**: Implement a full-stack application with clear API boundaries
- **Time Management**: Deliver a working product within the time constraint
- **Architecture**: Teams decide their own component structure and organization


## 📋 What is Wordle?

Wordle is a word-guessing game where players have 6 attempts to guess a secret 5-letter word. After each guess, tiles change color to provide feedback:

- 🟩 **Green**: Letter is correct and in the right position
- 🟨 **Yellow**: Letter is in the word but in the wrong position  
- ⬜ **Gray**: Letter is not in the word at all

### Example Game Flow

Secret word: `REACT`

1. **Guess**: `HELLO` → `⬜🟩⬜⬜⬜` (E is in the word, correct position)
2. **Guess**: `TRACE` → `🟨🟨🟩🟩🟨` (A,C correct positions; T,R,E wrong positions)
3. **Guess**: `REACT` → `🟩🟩🟩🟩🟩` (Victory! 🎉)

### Try it yourself
[New York Times: Wordle](https://www.nytimes.com/games/wordle/index.html)

## ✅ Acceptance Criteria

### Frontend Requirements (React/TypeScript)

**Must-Have Features:**
- [ ] 6×5 grid to display guesses and feedback
- [ ] Input mechanism for 5-letter words
- [ ] Color-coded feedback display (green/yellow/gray)
- [ ] Win/lose game state handling
- [ ] API integration for starting games and validating guesses
- [ ] Basic error handling for invalid inputs

**Optional Features:**
- [ ] On-screen keyboard with letter status tracking
- [ ] Smooth tile-flipping animations
- [ ] "Play Again" functionality
- [ ] Dark mode toggle
- [ ] Input validation and user-friendly error messages

### Backend Requirements (PHP)

**Must-Have Features:**
- [ ] API endpoints to handle game state and validate guesses.
- [ ] Random word selection from provided word list
- [ ] Session-based game state management
- [ ] Proper CORS headers for cross-origin requests
- [ ] Input validation and error handling

## 🏗️ Project Structure

```
wordle-team-challenge/
├── backend/                 # PHP API (DUMMY - needs implementation)
│   ├── api/                # TODO: Implement API endpoints 
│   ├── words.txt           # List of valid 5-letter words (provided)
│   └── README.md           # Backend setup guide
└── frontend/               # React/TypeScript (Hello World template)
    ├── src/
    │   ├── App.tsx         # Blank template - implement your game here!
    │   ├── App.css         # Basic styling template
    │   └── index.tsx       # App entry point (ready)
    ├── package.json        # Dependencies configured
    └── tsconfig.json       # TypeScript configuration

```

## 🎉 Have Fun!

Remember: This is about learning, collaboration, and having fun with code. Don't hesitate to ask for help, experiment with ideas, and celebrate your progress!

## 🚀 Quick Start

### Prerequisites
- PHP 8.3+ with a local server (XAMPP, WAMP, or `php -S`)
- Node.js 16+ and npm
- A code editor (VS Code recommended)
- Git for version control

### Setup Instructions

1. **Clone this repository**
   ```bash
   git clone <repository-url>
   cd wordle-team-challenge
   ```

2. **Start the Backend (PHP)**
   ```bash
   cd backend
   # Start the server
   php -S localhost:8000
   ```
   
   The API will be available at:
   - `http://localhost:8000/api/get-dummy-response.php`

3. **Start the Frontend (React)**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   
   The React app will open at `http://localhost:3000`
