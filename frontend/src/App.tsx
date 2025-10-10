import React, { useState, useEffect, useCallback } from 'react'
import WordleGrid from './components/WordleGrid'
import VirtualKeyboard from './components/VirtualKeyboard'
import { LetterStatus } from './components/LetterTile'

// API configuration
const API_BASE_URL = 'http://localhost:8000/api'

interface GameStats {
  gamesPlayed: number
  winPercentage: number
  currentStreak: number
  maxStreak: number
  guessDistribution: number[]
}

export default function App() {
  const [message, setMessage] = useState<string>(
    'Welcome to Wordle! Press Start Game to begin.'
  )
  const [isGameActive, setIsGameActive] = useState<boolean>(false)
  const [currentGuess, setCurrentGuess] = useState<string>('')
  const [guessCount, setGuessCount] = useState<number>(0)
  const [gameWon, setGameWon] = useState<boolean>(false)
  const [gameLost, setGameLost] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [justSubmitted, setJustSubmitted] = useState<boolean>(false)
  const [invalidWord, setInvalidWord] = useState<boolean>(false)
  const [results, setResults] = useState<
    Array<{ guess: string; result: { [key: string]: string } }>
  >([])
  const [letterStatuses, setLetterStatuses] = useState<{
    [key: string]: LetterStatus
  }>({})
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    winPercentage: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
  })

  // Load stats from localStorage on component mount
  useEffect(() => {
    const savedStats = localStorage.getItem('wordle-stats')
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }, [])

  // Save stats to localStorage whenever stats change
  useEffect(() => {
    localStorage.setItem('wordle-stats', JSON.stringify(stats))
  }, [stats])

  const updateLetterStatuses = useCallback(
    (result: { [key: string]: string }, guess: string) => {
      const newStatuses = { ...letterStatuses }

      Object.entries(result).forEach(([position, status]) => {
        const letter = guess[Number(position) - 1]
        const currentStatus = newStatuses[letter]

        // Only update if the new status is better (correct > present > absent)
        if (
          !currentStatus ||
          status === 'correct' ||
          (status === 'present' && currentStatus !== 'correct') ||
          (status === 'absent' &&
            currentStatus !== 'correct' &&
            currentStatus !== 'present')
        ) {
          newStatuses[letter] = status as LetterStatus
        }
      })

      setLetterStatuses(newStatuses)
    },
    [letterStatuses]
  )

  const updateStats = useCallback(
    (won: boolean, guesses: number) => {
      const newStats = { ...stats }
      newStats.gamesPlayed += 1

      if (won) {
        newStats.currentStreak += 1
        newStats.maxStreak = Math.max(
          newStats.maxStreak,
          newStats.currentStreak
        )
        newStats.guessDistribution[guesses - 1] += 1
      } else {
        newStats.currentStreak = 0
      }

      newStats.winPercentage = Math.round(
        ((newStats.gamesPlayed -
          newStats.guessDistribution.reduce((a, b) => a + b, 0)) /
          newStats.gamesPlayed) *
          100
      )

      setStats(newStats)
    },
    [stats]
  )

  const handleWordSubmit = useCallback(
    async (word: string) => {
      if (isSubmitting || gameWon || gameLost) return

      setIsSubmitting(true)
      // Don't clear currentGuess immediately - let it show until we get results

      try {
        // Submit word to the backend guess endpoint
        const response = await fetch(
          `${API_BASE_URL}/guess.php?guess=${word.toLowerCase()}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // CRITICAL: Include cookies for session management
          }
        )

        // Parse JSON regardless of status code to get error message
        let data
        try {
          data = await response.json()
        } catch (jsonError) {
          throw new Error(`Invalid JSON response from server: ${jsonError}`)
        }

        // Check if the response has an error status (including 400 responses)
        if (data.status === 'error') {
          // Show error message briefly, then restore the guess count message
          const errorMessage = data.message || 'Not in word list'
          setMessage(errorMessage)
          setInvalidWord(true)
          setTimeout(() => {
            setInvalidWord(false)
            setMessage(`Guess ${guessCount}/6`)
          }, 1500)
          setIsSubmitting(false)
          return
        }

        // Update state with backend response
        setGuessCount(data.guessCount)
        setResults(data.results)
        
        // Clear current guess immediately so new word can be typed in next row
        setCurrentGuess('')
        
        setJustSubmitted(true)
        setTimeout(() => {
          setJustSubmitted(false)
        }, 2000) // Keep justSubmitted flag for 2 seconds to prevent rapid submissions

        // Update letter statuses for keyboard
        const latestResult = data.results[data.results.length - 1]
        if (latestResult) {
          updateLetterStatuses(latestResult.result, latestResult.guess)
        }

        // Check if all letters are correct (game won)
        const allCorrect =
          latestResult &&
          Object.values(latestResult.result).every(
            (status) => status === 'correct'
          )

        if (allCorrect) {
          setGameWon(true)
          updateStats(true, data.guessCount)
          setMessage(`Congratulations! You won in ${data.guessCount} guesses!`)
          setIsSubmitting(false)
          return
        }

        // Check if we've reached the limit (game lost)
        if (data.guessCount >= 6) {
          setGameLost(true)
          updateStats(false, 6)
          setMessage(
            `Game over! You've used all 6 guesses. The word was: ${data.word}`
          )
          setIsSubmitting(false)
          return
        }

        setMessage(`Guess ${data.guessCount}/6`)
      } catch (error) {
        // Network or unexpected error - show user-friendly message
        setMessage('Connection error. Please try again.')
        setInvalidWord(true)
        setTimeout(() => {
          setInvalidWord(false)
          setMessage(`Guess ${guessCount}/6`)
        }, 2000)
        // Don't clear the guess so user can try again
      } finally {
        setIsSubmitting(false)
      }
    },
    [isSubmitting, gameWon, gameLost, guessCount, updateLetterStatuses, updateStats]
  )

  const handleKeyPress = useCallback(
    (key: string) => {
      if (
        currentGuess.length < 5 &&
        !isSubmitting &&
        !gameWon &&
        !gameLost &&
        !justSubmitted
      ) {
        setCurrentGuess((prev) => prev + key)
      }
    },
    [currentGuess.length, isSubmitting, gameWon, gameLost, justSubmitted]
  )

  const handleEnter = useCallback(() => {
    if (currentGuess.length < 5 && !isSubmitting && !gameWon && !gameLost) {
      setMessage('Not enough letters')
      setInvalidWord(true)
      setTimeout(() => {
        setInvalidWord(false)
        setMessage(`Guess ${guessCount}/6`)
      }, 1000)
      return
    }
    if (currentGuess.length === 5 && !isSubmitting && !gameWon && !gameLost) {
      handleWordSubmit(currentGuess)
    }
  }, [currentGuess, isSubmitting, gameWon, gameLost, guessCount, handleWordSubmit])

  const handleBackspace = useCallback(() => {
    if (currentGuess.length > 0 && !isSubmitting && !gameWon && !gameLost) {
      setCurrentGuess((prev) => prev.slice(0, -1))
    }
  }, [currentGuess.length, isSubmitting, gameWon, gameLost])

  // Add keyboard event listeners for physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard input when game is active and not submitting
      if (!isGameActive || isSubmitting) return

      // Prevent default for game keys
      if (
        e.key === 'Enter' ||
        e.key === 'Backspace' ||
        /^[a-zA-Z]$/.test(e.key)
      ) {
        e.preventDefault()
      }

      // Handle letter input
      if (
        /^[a-zA-Z]$/.test(e.key) &&
        currentGuess.length < 5 &&
        !gameWon &&
        !gameLost
      ) {
        handleKeyPress(e.key.toUpperCase())
      }
      // Handle Enter key
      else if (
        e.key === 'Enter' &&
        currentGuess.length === 5 &&
        !gameWon &&
        !gameLost
      ) {
        handleEnter()
      }
      // Handle Backspace
      else if (
        e.key === 'Backspace' &&
        currentGuess.length > 0 &&
        !gameWon &&
        !gameLost
      ) {
        handleBackspace()
      }
    }

    // Add event listener
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    isGameActive,
    isSubmitting,
    currentGuess,
    gameWon,
    gameLost,
    handleKeyPress,
    handleEnter,
    handleBackspace,
  ])

  const startGame = async () => {
    // Reset game state first
    setIsGameActive(false)
    setGuessCount(0)
    setGameWon(false)
    setGameLost(false)
    setCurrentGuess('')
    setResults([])
    setLetterStatuses({})
    setIsSubmitting(false)
    setJustSubmitted(false)

    try {
      const response = await fetch(`${API_BASE_URL}/start.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // CRITICAL: Include cookies for session management
      })

      if (response.ok) {
        let data
        try {
          data = await response.json()
        } catch (jsonError) {
          setMessage(`Invalid JSON response from server: ${jsonError}`)
          return
        }

        if (data.status === 'error') {
          setMessage(data.message)
          return
        }

        setMessage('Game started! Enter your first 5-letter word.')
        setIsGameActive(true)
      } else {
        setMessage('Failed to start game. Please try again.')
        return
      }
    } catch (error) {
      setMessage('Failed to connect to backend. Please try again.')
      return
    }
  }

  const resetGame = () => {
    setIsGameActive(false)
    setGuessCount(0)
    setGameWon(false)
    setGameLost(false)
    setCurrentGuess('')
    setResults([])
    setLetterStatuses({})
    setJustSubmitted(false)
    setMessage('Welcome to Wordle! Press Start Game to begin.')
  }

  return (
    <div className="app">
      <header>
        <h1>Wordle</h1>
      </header>

      <main>
        <div className="message">{message}</div>

        <div className="game-controls">
          {!isGameActive ? (
            <button onClick={startGame} className="start-game-btn">
              Start Game
            </button>
          ) : (
            <div className="game-area">
              <div className="game-info">
                <p>Guess {guessCount}/6</p>
                {gameWon && <p className="game-status won">You Won! 🎉</p>}
                {gameLost && <p className="game-status lost">Game Over! 😞</p>}
              </div>

              <div className="game-board">
                <WordleGrid
                  results={results}
                  currentGuess={currentGuess}
                  isSubmitting={isSubmitting}
                  invalidWord={invalidWord}
                />
              </div>

              <VirtualKeyboard
                onKeyPress={handleKeyPress}
                onEnter={handleEnter}
                onBackspace={handleBackspace}
                letterStatuses={letterStatuses}
                disabled={gameWon || gameLost || isSubmitting}
              />

              {(gameWon || gameLost) && (
                <div className="game-end-controls">
                  <button onClick={resetGame} className="reset-game-btn">
                    Play Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
