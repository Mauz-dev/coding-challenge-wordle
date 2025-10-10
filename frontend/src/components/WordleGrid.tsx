import React, { useState, useEffect } from 'react'
import LetterTile, { LetterStatus } from './LetterTile'
import './wordleGrid.css'

interface WordleGridProps {
  results: Array<{
    guess: string
    result: { [key: string]: string }
  }>
  currentGuess?: string
  isSubmitting?: boolean
  invalidWord?: boolean
}

const WordleGrid: React.FC<WordleGridProps> = ({
  results,
  currentGuess = '',
  isSubmitting = false,
  invalidWord = false,
}) => {
  const [shakingRow, setShakingRow] = useState<number | null>(null)
  const [revealingRow, setRevealingRow] = useState<number | null>(null)

  useEffect(() => {
    if (invalidWord && currentGuess) {
      setShakingRow(results.length)
      const timer = setTimeout(() => setShakingRow(null), 500)
      return () => clearTimeout(timer)
    }
  }, [invalidWord, currentGuess, results.length])

  // Trigger reveal animation for the most recent result
  useEffect(() => {
    if (results.length > 0) {
      setRevealingRow(results.length - 1)
      const timer = setTimeout(() => setRevealingRow(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [results.length])
  // Function to map result status to LetterStatus
  const mapStatusToLetterStatus = (status: string): LetterStatus => {
    switch (status) {
      case 'correct':
        return 'correct'
      case 'present':
        return 'present'
      case 'absent':
        return 'absent'
      default:
        return 'absent'
    }
  }

  // Create 6 rows total
  const totalRows = 6
  const rows = []

  // Add completed guess rows (these should always be visible)
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    const guessArray = result.guess.split('')
    const isRevealing = revealingRow === i
    rows.push(
      <div key={`result-${i}`} className={'row'}>
        {[1, 2, 3, 4, 5].map((position) => {
          const letter = guessArray[position - 1] || ''
          const status = result.result[position] || 'absent'
          const letterStatus = mapStatusToLetterStatus(status)
          const tileIndex = position - 1

          return (
            <LetterTile 
              key={position} 
              letter={letter} 
              status={letterStatus}
              shouldFlip={isRevealing}
              flipDelay={tileIndex * 300}
            />
          )
        })}
      </div>
    )
  }

  // Add current guess row if there's an active guess and we haven't filled all rows
  if (currentGuess && results.length < totalRows) {
    const currentGuessArray = currentGuess.split('')
    const isShaking = shakingRow === results.length
    rows.push(
      <div key="current-guess" className={`row ${isShaking ? 'row-shake' : ''}`}>
        {Array.from({ length: 5 }, (_, index) => {
          const letter = currentGuessArray[index] || ''
          return (
            <LetterTile
              key={index}
              letter={letter}
              status="empty"
              isActive={index === currentGuess.length}
            />
          )
        })}
      </div>
    )
  }

  // Add empty rows to fill up to 6 total
  const totalUsedRows = results.length + (currentGuess ? 1 : 0)
  for (let i = totalUsedRows; i < totalRows; i++) {
    rows.push(
      <div key={`empty-${i}`} className={'row'}>
        {Array.from({ length: 5 }, (_, index) => (
          <LetterTile key={index} letter="" status="empty" />
        ))}
      </div>
    )
  }

  return <section className={'wordle-grid'}>{rows}</section>
}

export default WordleGrid
