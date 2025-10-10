import React, { useState, useEffect, useRef } from 'react'
import LetterTile, { LetterStatus } from './LetterTile'

interface WordInputProps {
  onSubmit: (word: string) => void
  onKeyPress: (key: string) => void
  onEnter: () => void
  onBackspace: () => void
  isDisabled?: boolean
  maxLength?: number
  currentGuess?: string
  isSubmitting?: boolean
}

const WordInput: React.FC<WordInputProps> = ({
  onSubmit,
  onKeyPress,
  onEnter,
  onBackspace,
  isDisabled = false,
  maxLength = 5,
  currentGuess = '',
  isSubmitting = false,
}) => {
  const [input, setInput] = useState('')
  const [letterStatuses, setLetterStatuses] = useState<LetterStatus[]>(
    Array(maxLength).fill('empty')
  )
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInput(currentGuess)
  }, [currentGuess])

  useEffect(() => {
    if (!isDisabled && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isDisabled])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()

    // Only allow letters (no numbers, special characters, or spaces) and limit to maxLength
    if (value.length <= maxLength && /^[A-Z]*$/.test(value)) {
      setInput(value)
      onKeyPress(value[value.length - 1] || '')

      // Update letter statuses - show empty for unfilled positions
      const newStatuses = Array(maxLength).fill('empty')
      for (let i = 0; i < value.length; i++) {
        newStatuses[i] = 'empty'
      }
      setLetterStatuses(newStatuses)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent number keys from being typed
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault()
      return
    }

    if (
      e.key === 'Enter' &&
      input.length === maxLength &&
      !isDisabled &&
      !isSubmitting
    ) {
      onSubmit(input)
    } else if (e.key === 'Backspace' && input.length === 0) {
      onBackspace()
      return
    }
  }

  return (
    <div className="word-input-container">
      <div className="word-input-tiles">
        {Array.from({ length: maxLength }, (_, index) => (
          <LetterTile
            key={index}
            letter={input[index] || ''}
            status={letterStatuses[index]}
            isActive={index === input.length && !isDisabled}
          />
        ))}
      </div>

      {/* Hidden input for mobile focus management */}
      <div className="word-input-controls">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isDisabled || isSubmitting}
          maxLength={maxLength}
          className="word-input-field"
          placeholder="Enter word"
          autoComplete="off"
          spellCheck="false"
          style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
        />
      </div>
    </div>
  )
}

export default WordInput
