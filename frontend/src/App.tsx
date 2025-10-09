import React, { useState } from 'react'
import WordInput from './components/WordInput'
import WordleGrid from './components/WordleGrid'

// API configuration
const API_BASE_URL = 'http://localhost:8000/api'

export default function App() {
  const [message, setMessage] = useState<string>(
    'Welcome to Wordle Challenge! Start implementing your game.'
  )
  const [isGameActive, setIsGameActive] = useState<boolean>(false)
  const [currentWord, setCurrentWord] = useState<string>('')
  const [guessCount, setGuessCount] = useState<number>(0)
  const [gameWon, setGameWon] = useState<boolean>(false)
  const [gameLost, setGameLost] = useState<boolean>(false)
  const [results, setResults] = useState<string[]>([])

  const testBackendConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-dummy-response.php`)
      const data = await response.json()
      setMessage(`Backend response: ${data.message}`)
    } catch (error) {
      setMessage(
        'Could not connect to backend. Make sure it is running on localhost:8000'
      )
    }
  }

  const handleWordSubmit = async (word: string) => {
    try {
      setMessage(`Submitting word: ${word} (Guess ${guessCount + 1}/6)`)

      // Submit word to the backend guess endpoint
      const response = await fetch(`${API_BASE_URL}/guess?word=${word.toLowerCase()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
   
      setGuessCount(data.guessCount)
      setCurrentWord(word)
      setResults(data.results)

      // Check if all letters are correct (game won)
      const allCorrect = Object.values(data).every(
        (status) => status === 'correct'
      )
      if (allCorrect) {
        setGameWon(true)
        setMessage(`Congratulations! You won in ${guessCount} guesses!`)
        return
      }

      // Check if we've reached the limit (game lost)
      if (guessCount >= 6) {
        setGameLost(true)
        setMessage(
          `Game over! You've used all 6 guesses. The word was: ${word}`
        )
        return
      }

      setMessage(
        `Word submitted: ${word}. Response: ${JSON.stringify(data)}. Guesses remaining: ${6 - guessCount}`
      )
    } catch (error) {
      setMessage(`Error submitting word: ${error}`)
    }
  }

  const startGame = () => {
    setIsGameActive(true)
    setGuessCount(0)
    setGameWon(false)
    setGameLost(false)
    setCurrentWord('')
    setMessage(
      'Game started! Enter your first 5-letter word. You have 6 guesses.'
    )
  }

  const resetGame = () => {
    setIsGameActive(false)
    setGuessCount(0)
    setGameWon(false)
    setGameLost(false)
    setCurrentWord('')
    setMessage('Welcome to Wordle Challenge! Start implementing your game.')
  }

  return (
    <div className="app">
      <header>
        <h1>Wordle Team Challenge</h1>
        <p>Hello World! This is your starting template.</p>
      </header>
      <main>
        <div>{message}</div>

        <div className="game-controls">
          <button onClick={testBackendConnection}>
            Test Backend Connection
          </button>

          {!isGameActive ? (
            <button onClick={startGame} className="start-game-btn">
              Start Game
            </button>
          ) : (
            <div className="game-area">
              <div className="game-info">
                <p>Guesses: {guessCount}/6</p>
                {gameWon && <p className="game-status won">You Won!</p>}
                {gameLost && (
                  <p className="game-status lost">Game Over!</p>
                )}
              </div>

              <WordInput
                onSubmit={handleWordSubmit}
                isDisabled={gameWon || gameLost}
                maxLength={5}
              />

              {currentWord && (
                <div className="current-word-display">
                  <p>
                    Current word: <strong>{currentWord}</strong>
                  </p>
                </div>
              )}

              {(gameWon || gameLost) && (
                <button onClick={resetGame} className="reset-game-btn">
                  Play Again
                </button>
              )}
            </div>
          )}
        </div>
{/*
        <WordleGrid />
*/}
{/*
        <input type="text"  />
*/}
      </main>
    </div>
  )
}
