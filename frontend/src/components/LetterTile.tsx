import React, { useEffect, useState } from 'react'

export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty'

interface LetterTileProps {
  letter: string
  status: LetterStatus
  isActive?: boolean
  shouldFlip?: boolean
  flipDelay?: number
}

const LetterTile: React.FC<LetterTileProps> = ({
  letter,
  status,
  isActive = false,
  shouldFlip = false,
  flipDelay = 0,
}) => {
  const [shouldPop, setShouldPop] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (letter && status === 'empty') {
      setShouldPop(true)
      const timer = setTimeout(() => setShouldPop(false), 100)
      return () => clearTimeout(timer)
    }
  }, [letter, status])

  useEffect(() => {
    if (shouldFlip && status !== 'empty') {
      const timer = setTimeout(() => {
        setIsFlipping(true)
        const resetTimer = setTimeout(() => setIsFlipping(false), 600)
        return () => clearTimeout(resetTimer)
      }, flipDelay)
      return () => clearTimeout(timer)
    }
  }, [shouldFlip, flipDelay, status])

  return (
    <div
      className={`letter-tile letter-tile-${status} ${isActive ? 'letter-tile-active' : ''} ${shouldPop ? 'letter-tile-pop' : ''} ${isFlipping ? 'letter-tile-flip' : ''}`}
    >
      {letter.toUpperCase()}
    </div>
  )
}

export default LetterTile
