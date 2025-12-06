import React, { memo } from 'react'

const Cell = memo(function Cell({ row, col, value, isPossibleMove, onClick }) {
  const handleClick = () => {
    onClick(row, col)
  }

  return (
    <div
      className={`cell ${value ? `occupied ${value}` : ''} ${isPossibleMove ? 'possible-move' : ''}`}
      onClick={handleClick}
    >
      {value && <span className="marker">{value}</span>}
    </div>
  )
})

export default Cell

