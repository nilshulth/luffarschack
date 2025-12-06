import React, { useMemo } from 'react'
import { useGame } from './hooks/useGame'
import Board from './components/Board'

function App() {
  const {
    board,
    currentPlayer,
    gameOver,
    winner,
    gameMode,
    isAiThinking,
    makeMove,
    resetGame,
    changeGameMode,
    getPossibleMoves,
    BOARD_SIZE,
  } = useGame()

  const possibleMoves = useMemo(() => getPossibleMoves(), [getPossibleMoves])

  const getStatusText = () => {
    if (winner) return `${winner} vinner!`
    if (gameOver) return 'Oavgjort!'
    if (isAiThinking) return 'AI tänker...'
    return `${currentPlayer}s tur`
  }

  return (
    <div className="app">
      <div className="game-wrapper">
        <header className="header">
          <h1>Luffarschack</h1>
          <p className="subtitle">Fem i rad • 30×30</p>
        </header>

        <div className="game-container">
          <div className="board-wrapper">
            <Board
              board={board}
              possibleMoves={possibleMoves}
              onCellClick={makeMove}
              boardSize={BOARD_SIZE}
            />
          </div>

          <div className="game-info">
            <div className={`status ${winner ? 'winner' : ''} ${isAiThinking ? 'thinking' : ''}`}>
              <span className={`player-indicator ${currentPlayer}`}>{currentPlayer}</span>
              <span className="status-text">{getStatusText()}</span>
            </div>

            <div className="controls">
              <div className="control-group">
                <label htmlFor="game-mode">Spelläge</label>
                <select
                  id="game-mode"
                  value={gameMode}
                  onChange={(e) => changeGameMode(e.target.value)}
                >
                  <option value="ai">Spelare vs AI</option>
                  <option value="human">Spelare vs Spelare</option>
                </select>
              </div>

              <button className="reset-button" onClick={resetGame}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Nytt spel
              </button>
            </div>
          </div>
        </div>

        <footer className="footer">
          <p>Klicka på en grön ruta för att placera din markör</p>
        </footer>
      </div>
    </div>
  )
}

export default App

