import { useState, useCallback, useRef, useEffect } from 'react'

const BOARD_SIZE = 30
const WIN_CONDITION = 5
const MAX_DEPTH = 2

const createEmptyBoard = () => {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
}

export function useGame() {
  const [board, setBoard] = useState(createEmptyBoard)
  const [currentPlayer, setCurrentPlayer] = useState('X')
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState(null)
  const [gameMode, setGameMode] = useState('ai')
  const [firstMoveMade, setFirstMoveMade] = useState(false)
  const [isAiThinking, setIsAiThinking] = useState(false)
  
  const boardRef = useRef(board)
  boardRef.current = board

  const checkWin = useCallback((boardState, row, col, player) => {
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1]
    ]

    for (const [dr, dc] of directions) {
      let count = 1
      for (let i = 1; i < WIN_CONDITION; i++) {
        const r = row + i * dr
        const c = col + i * dc
        if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && boardState[r][c] === player) {
          count++
        } else {
          break
        }
      }
      for (let i = 1; i < WIN_CONDITION; i++) {
        const r = row - i * dr
        const c = col - i * dc
        if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && boardState[r][c] === player) {
          count++
        } else {
          break
        }
      }
      if (count >= WIN_CONDITION) {
        return true
      }
    }
    return false
  }, [])

  const isValidMove = useCallback((boardState, row, col, isFirstMove) => {
    if (boardState[row][col] !== null) return false
    if (!isFirstMove) return true

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (boardState[r][c] !== null) {
          const dr = Math.abs(row - r)
          const dc = Math.abs(col - c)
          if (dr <= 1 && dc <= 1) {
            return true
          }
        }
      }
    }
    return false
  }, [])

  const getAvailableMoves = useCallback((boardState, isFirstMove) => {
    const moves = []
    const checkedMoves = new Set()

    if (!isFirstMove) {
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          if (boardState[r][c] === null) {
            moves.push({ r, c })
          }
        }
      }
    } else {
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          if (boardState[r][c] !== null) {
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue
                const nr = r + dr
                const nc = c + dc
                if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && boardState[nr][nc] === null) {
                  const moveKey = `${nr},${nc}`
                  if (!checkedMoves.has(moveKey)) {
                    moves.push({ r: nr, c: nc })
                    checkedMoves.add(moveKey)
                  }
                }
              }
            }
          }
        }
      }
    }
    return moves
  }, [])

  const evaluateBoard = useCallback((boardState, player) => {
    let score = 0
    const opponent = player === 'X' ? 'O' : 'X'
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]]

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        for (const [dr, dc] of directions) {
          const endR = r + (WIN_CONDITION - 1) * dr
          const endC = c + (WIN_CONDITION - 1) * dc

          if (endR >= 0 && endR < BOARD_SIZE && endC >= 0 && endC < BOARD_SIZE) {
            let playerCount = 0
            let opponentCount = 0
            let emptyCount = 0

            for (let i = 0; i < WIN_CONDITION; i++) {
              const nr = r + i * dr
              const nc = c + i * dc
              if (boardState[nr][nc] === player) {
                playerCount++
              } else if (boardState[nr][nc] === opponent) {
                opponentCount++
              } else {
                emptyCount++
              }
            }

            if (playerCount > 0 && opponentCount === 0) {
              if (playerCount === WIN_CONDITION) score += 100000
              else if (playerCount === WIN_CONDITION - 1 && emptyCount >= 1) score += 1000
              else if (playerCount === WIN_CONDITION - 2 && emptyCount >= 2) {
                let openEnds = 0
                const prevR = r - dr
                const prevC = c - dc
                if ((prevR >= 0 && prevR < BOARD_SIZE && prevC >= 0 && prevC < BOARD_SIZE && boardState[prevR][prevC] === null) ||
                    !(prevR >= 0 && prevR < BOARD_SIZE && prevC >= 0 && prevC < BOARD_SIZE)) {
                  openEnds++
                }
                const nextR = r + WIN_CONDITION * dr
                const nextC = c + WIN_CONDITION * dc
                if ((nextR >= 0 && nextR < BOARD_SIZE && nextC >= 0 && nextC < BOARD_SIZE && boardState[nextR][nextC] === null) ||
                    !(nextR >= 0 && nextR < BOARD_SIZE && nextC >= 0 && nextC < BOARD_SIZE)) {
                  openEnds++
                }
                if (openEnds >= 2) score += 900
                else if (openEnds === 1) score += 90
              }
              else if (playerCount === WIN_CONDITION - 3 && emptyCount >= 3) score += 10
            } else if (opponentCount > 0 && playerCount === 0) {
              if (opponentCount === WIN_CONDITION) score -= 100000
              else if (opponentCount === WIN_CONDITION - 1 && emptyCount >= 1) score -= 9000
              else if (opponentCount === WIN_CONDITION - 2 && emptyCount >= 2) {
                let openEnds = 0
                const prevR = r - dr
                const prevC = c - dc
                if ((prevR >= 0 && prevR < BOARD_SIZE && prevC >= 0 && prevC < BOARD_SIZE && boardState[prevR][prevC] === null) ||
                    !(prevR >= 0 && prevR < BOARD_SIZE && prevC >= 0 && prevC < BOARD_SIZE)) {
                  openEnds++
                }
                const nextR = r + WIN_CONDITION * dr
                const nextC = c + WIN_CONDITION * dc
                if ((nextR >= 0 && nextR < BOARD_SIZE && nextC >= 0 && nextC < BOARD_SIZE && boardState[nextR][nextC] === null) ||
                    !(nextR >= 0 && nextR < BOARD_SIZE && nextC >= 0 && nextC < BOARD_SIZE)) {
                  openEnds++
                }
                if (openEnds >= 2) score -= 8000
                else if (openEnds === 1) score -= 800
              }
              else if (opponentCount === WIN_CONDITION - 3 && emptyCount >= 3) score -= 80
            }
          }
        }
      }
    }
    return score
  }, [])

  const minimax = useCallback((boardState, depth, isMaximizingPlayer, alpha, beta, isFirstMove) => {
    if (depth === 0) {
      return evaluateBoard(boardState, 'O')
    }

    const availableMoves = getAvailableMoves(boardState, isFirstMove)
    if (availableMoves.length === 0) {
      return 0
    }

    if (isMaximizingPlayer) {
      let bestScore = -Infinity
      for (const move of availableMoves) {
        boardState[move.r][move.c] = 'O'
        const score = minimax(boardState, depth - 1, false, alpha, beta, true)
        boardState[move.r][move.c] = null

        bestScore = Math.max(bestScore, score)
        alpha = Math.max(alpha, bestScore)
        if (beta <= alpha) break
      }
      return bestScore
    } else {
      let bestScore = Infinity
      for (const move of availableMoves) {
        boardState[move.r][move.c] = 'X'
        const score = minimax(boardState, depth - 1, true, alpha, beta, true)
        boardState[move.r][move.c] = null

        bestScore = Math.min(bestScore, score)
        beta = Math.min(beta, bestScore)
        if (beta <= alpha) break
      }
      return bestScore
    }
  }, [evaluateBoard, getAvailableMoves])

  const makeAiMove = useCallback((boardState, isFirstMove) => {
    const boardCopy = boardState.map(row => [...row])
    
    if (!isFirstMove) {
      const centerRow = Math.floor(BOARD_SIZE / 2)
      const centerCol = Math.floor(BOARD_SIZE / 2)
      if (boardCopy[centerRow][centerCol] === null) {
        return { r: centerRow, c: centerCol }
      }
    }

    const availableMoves = getAvailableMoves(boardCopy, isFirstMove)
    if (availableMoves.length === 0) return null

    let bestScore = -Infinity
    let bestMove = null

    for (const move of availableMoves) {
      boardCopy[move.r][move.c] = 'O'
      const score = minimax(boardCopy, MAX_DEPTH, false, -Infinity, Infinity, true)
      boardCopy[move.r][move.c] = null

      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
    }

    return bestMove || availableMoves[Math.floor(Math.random() * availableMoves.length)]
  }, [getAvailableMoves, minimax])

  const makeMove = useCallback((row, col) => {
    if (gameOver || isAiThinking) return false
    if (!isValidMove(board, row, col, firstMoveMade)) return false

    const newBoard = board.map(r => [...r])
    newBoard[row][col] = currentPlayer

    setBoard(newBoard)
    setFirstMoveMade(true)

    if (checkWin(newBoard, row, col, currentPlayer)) {
      setWinner(currentPlayer)
      setGameOver(true)
      return true
    }

    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X'
    setCurrentPlayer(nextPlayer)

    if (nextPlayer === 'O' && gameMode === 'ai') {
      setIsAiThinking(true)
    }

    return true
  }, [board, currentPlayer, gameOver, gameMode, firstMoveMade, isAiThinking, isValidMove, checkWin])

  useEffect(() => {
    if (isAiThinking && currentPlayer === 'O' && !gameOver && gameMode === 'ai') {
      const timer = setTimeout(() => {
        const aiMove = makeAiMove(boardRef.current, firstMoveMade)
        if (aiMove) {
          const newBoard = boardRef.current.map(r => [...r])
          newBoard[aiMove.r][aiMove.c] = 'O'
          setBoard(newBoard)

          if (checkWin(newBoard, aiMove.r, aiMove.c, 'O')) {
            setWinner('O')
            setGameOver(true)
          } else {
            setCurrentPlayer('X')
          }
        }
        setIsAiThinking(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isAiThinking, currentPlayer, gameOver, gameMode, firstMoveMade, makeAiMove, checkWin])

  const getPossibleMoves = useCallback(() => {
    if (gameOver) return new Set()
    
    const moves = new Set()
    
    if (!firstMoveMade) {
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          if (board[r][c] === null) {
            moves.add(`${r},${c}`)
          }
        }
      }
    } else {
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          if (board[r][c] !== null) {
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue
                const nr = r + dr
                const nc = c + dc
                if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === null) {
                  moves.add(`${nr},${nc}`)
                }
              }
            }
          }
        }
      }
    }
    return moves
  }, [board, firstMoveMade, gameOver])

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard())
    setCurrentPlayer('X')
    setGameOver(false)
    setWinner(null)
    setFirstMoveMade(false)
    setIsAiThinking(false)
  }, [])

  const changeGameMode = useCallback((mode) => {
    setGameMode(mode)
    resetGame()
  }, [resetGame])

  return {
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
  }
}

