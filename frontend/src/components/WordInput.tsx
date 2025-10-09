import React, { useState, useEffect, useRef } from 'react'
import LetterTile, { LetterStatus } from './LetterTile'

interface WordInputProps {
  onSubmit: (word: string) => void
  isDisabled?: boolean
  maxLength?: number
}

const WordInput: React.FC<WordInputProps> = ({
  onSubmit,
  isDisabled = false,
  maxLength = 5
}) => {
  const [input, setInput] = useState('')
  const [letterStatuses, setLetterStatuses] = useState<LetterStatus[]>(
    Array(maxLength).fill('empty')
  )
  const inputRef = useRef<HTMLInputElement>(null)

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

    if (e.key === 'Enter' && input.length === maxLength && !isDisabled) {
      onSubmit(input)
    } else if (e.key === 'Backspace' && input.length === 0) {
      // Allow backspace even when input is empty for better UX
      return
    }
  }

  const handleSubmit = () => {
    if (input.length === maxLength && !isDisabled) {
      onSubmit(input)
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

      <div className="word-input-controls">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          maxLength={maxLength}
          className="word-input-field"
          placeholder="Enter word"
          autoComplete="off"
          spellCheck="false"
        />

        <button
          onClick={handleSubmit}
          disabled={input.length !== maxLength || isDisabled}
          className="word-input-submit"
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default WordInput
