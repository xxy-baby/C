import React, { useState } from 'react';
import './styles.css'; // 假设你有一个styles.css文件来定义样式

const boardSize = 15; // 定义棋盘大小为15x15
const initialSquares = Array(boardSize * boardSize).fill(null);
const maxUndoMoves = 3; // 每个玩家最多悔棋3次

const calculateWinner = (squares) => {
  // 检查所有可能的胜利组合
  const lines = [
    // 横向
    ...Array(boardSize).fill(null).map((_, i) => Array(boardSize).fill(null).map((_, j) => i * boardSize + j)),
    // 纵向
    ...Array(boardSize).fill(null).map((_, j) => Array(boardSize).fill(null).map((_, i) => i * boardSize + j)),
    // 正斜线
    ...Array(boardSize - 4).fill(null).map((_, i) => Array(5).fill(null).map((_, j) => i * boardSize + j + j)),
    // 反斜线
    ...Array(boardSize - 4).fill(null).map((_, i) => Array(5).fill(null).map((_, j) => i * boardSize + (boardSize - 1 - j) - j)),
  ];

  for (let line of lines) {
    for (let i = 0; i <= line.length - 5; i++) {
      const row = line.slice(i, i + 5);
      const first = squares[row[0]];
      if (first && row.every((square) => squares[square] === first)) {
        return first;
      }
    }
  }
  return null;
};

const App = () => {
  const [squares, setSquares] = useState(initialSquares);
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([initialSquares]);
  const [stepNumber, setStepNumber] = useState(0);
  const [undoCount, setUndoCount] = useState({ X: 0, O: 0 }); // 跟踪每个玩家的悔棋次数

  const handleClick = (i) => {
    const newSquares = squares.slice();
    if (newSquares[i] || calculateWinner(newSquares)) {
      return;
    }
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
    const newHistory = [...history.slice(0, stepNumber + 1), newSquares];
    setHistory(newHistory);
    setStepNumber(newHistory.length - 1);
    const winner = calculateWinner(newSquares);
    if (winner) {
      alert(`Winner: ${winner}`);
    }
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setSquares(history[step]);
    setXIsNext((step % 2) === 0);
  };

  const undoMove = () => {
    if (stepNumber > 0) {
      const currentPlayer = xIsNext ? 'X' : 'O';
      if (undoCount[currentPlayer] < maxUndoMoves) {
        jumpTo(stepNumber - 1);
        setUndoCount({ ...undoCount, [currentPlayer]: undoCount[currentPlayer] + 1 });
      } else {
        alert(`Player ${currentPlayer} has reached the maximum number of undo moves.`);
      }
    }
  };

  const renderSquare = (i) => (
    <button className="square" onClick={() => handleClick(i)}>
      {squares[i]}
    </button>
  );

  const renderBoard = () => {
    let board = [];
    for (let i = 0; i < boardSize; i++) {
      let row = [];
      for (let j = 0; j < boardSize; j++) {
        row.push(renderSquare(i * boardSize + j));
      }
      board.push(<div className="board-row">{row}</div>);
    }
    return board;
  };

  const restartGame = () => {
    setSquares(initialSquares);
    setXIsNext(true);
    setHistory([initialSquares]);
    setStepNumber(0);
    setUndoCount({ X: 0, O: 0 }); // 重置悔棋次数
  };

  return (
    <div className="game">
      <div className="game-board">
        {renderBoard()}
      </div>
      <div className="game-info">
        <div>{`Next player: ${xIsNext ? 'X' : 'O'}`}</div>
        <button onClick={restartGame}>Restart Game</button>
        <button onClick={undoMove}>Undo Move</button>
      </div>
    </div>
  );
};

export default App;