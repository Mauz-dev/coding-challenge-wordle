import React from 'react'
import './wordleGrid.css'

interface WordleGridProps {
  results: Array<{
    guess: string
    result: { [key: string]: string }
  }>
  word: string
}

const WordleGrid: React.FC<WordleGridProps> = ({ results, word }) => {
  const wordArray = word.split('')

  return (
    <section className={'wordle-grid'}>
      {results.map((result, index) => (
        <div key={index} className={'row'}>
          {result.result &&
            Object.entries(result.result).map(([position, letter]) => (
              <div key={position} className={'cell'}>
                {wordArray[Number(position) - 1]}
              </div>
            ))}
        </div>
      ))}
    </section>
  )
}

export default WordleGrid
