import React from 'react'

export type LetterStatus = 'correct' | 'present' | 'absent'

interface LetterTileProps {
  letter: string
  status: LetterStatus
  isActive?: boolean
}

const LetterTile: React.FC<LetterTileProps> = ({
  letter,
  status,
  isActive = false,
}) => {
  const getStatusClass = () => {
    switch (status) {
      case 'correct':
        return 'letter-tile-correct'
      case 'present':
        return 'letter-tile-present'
      case 'absent':
        return 'letter-tile-absent'
    }
  }

  return (
    <div
      className={`letter-tile ${getStatusClass()} ${isActive ? 'letter-tile-active' : ''}`}
    >
      {letter.toUpperCase()}
    </div>
  )
}

export default LetterTile
