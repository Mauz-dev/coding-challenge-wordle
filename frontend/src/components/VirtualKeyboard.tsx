import React from 'react'
import { LetterStatus } from './LetterTile'
import './VirtualKeyboard.css'

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void
  onEnter: () => void
  onBackspace: () => void
  letterStatuses: { [key: string]: LetterStatus }
  disabled?: boolean
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  onEnter,
  onBackspace,
  letterStatuses,
  disabled = false
}) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ]

  const getKeyClass = (key: string) => {
    if (key === 'ENTER' || key === 'BACKSPACE') {
      return 'keyboard-key keyboard-key-wide'
    }
    
    const status = letterStatuses[key]
    if (status) {
      return `keyboard-key keyboard-key-${status}`
    }
    
    return 'keyboard-key'
  }

  const handleKeyClick = (key: string) => {
    if (disabled) return
    
    if (key === 'ENTER') {
      onEnter()
    } else if (key === 'BACKSPACE') {
      onBackspace()
    } else {
      onKeyPress(key)
    }
  }

  return (
    <div className="virtual-keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className={getKeyClass(key)}
              onClick={() => handleKeyClick(key)}
              disabled={disabled}
            >
              {key === 'BACKSPACE' ? '⌫' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

export default VirtualKeyboard
