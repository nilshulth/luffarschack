import React, { useMemo } from 'react'
import Cell from './Cell'

function Board({ board, possibleMoves, onCellClick, boardSize }) {
  const cells = useMemo(() => {
    const result = []
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const isPossibleMove = possibleMoves.has(`${row},${col}`)
        result.push(
          <Cell
            key={`${row}-${col}`}
            row={row}
            col={col}
            value={board[row][col]}
            isPossibleMove={isPossibleMove}
            onClick={onCellClick}
          />
        )
      }
    }
    return result
  }, [board, possibleMoves, onCellClick, boardSize])

  return (
    <div 
      className="board" 
      style={{ 
        gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
        gridTemplateRows: `repeat(${boardSize}, 1fr)` 
      }}
    >
      {cells}
    </div>
  )
}

export default Board

