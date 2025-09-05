import { useState } from "react";
import "./styles.css";

function Square({ value, onClick, isWinning, disabled, index }) {
  return (
    <button
      className={`square3d ${isWinning ? "square-win" : ""} ${
        value ? "filled" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`cell ${index + 1}${value ? `, ${value}` : ""}`}
    >
      <span
        className={`mark ${value === "X" ? "x" : value === "O" ? "o" : ""}`}
      >
        {value}
      </span>
    </button>
  );
}

function calcWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diags
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line: [a, b, c] };
    }
  }
  return null;
}

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winnerInfo = calcWinner(board);
  const isDraw = !winnerInfo && board.every(Boolean);
  const gameOver = Boolean(winnerInfo) || isDraw;

  function handleClick(index) {
    if (gameOver || board[index]) return;
    const next = board.slice();
    next[index] = xIsNext ? "X" : "O";
    setBoard(next);
    setXIsNext(!xIsNext);
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  const status = winnerInfo
    ? `Winner: ${winnerInfo.player}`
    : isDraw
    ? "Draw"
    : `Next: ${xIsNext ? "X" : "O"}`;

  return (
    <div className="page">
      <div className="bg-gradient" />
      <div className="card">
        <header className="header">
          <h1 className="title">Tic Tac Toe</h1>
          <button className="reset" onClick={reset} aria-label="restart game">
            ↻ Restart
          </button>
        </header>

        <div className="statusBar" role="status" aria-live="polite">
          <div className={`pill ${winnerInfo ? "done" : isDraw ? "draw" : ""}`}>
            {status}
          </div>
          {!gameOver && (
            <div className="avatars">
              <div className={`avatar ${xIsNext ? "active" : ""}`}>
                <span className="badge">X</span>
                <span>Player X</span>
              </div>
              <div className={`avatar ${!xIsNext ? "active" : ""}`}>
                <span className="badge alt">O</span>
                <span>Player O</span>
              </div>
            </div>
          )}
        </div>

        <div className="board">
          {board.map((cell, i) => (
            <Square
              key={i}
              index={i}
              value={cell}
              isWinning={winnerInfo?.line.includes(i)}
              disabled={gameOver || Boolean(cell)}
              onClick={() => handleClick(i)}
            />
          ))}
        </div>

        <footer className="footer">
          <p>Play with mouse or keyboard (Tab to a cell, press Enter/Space).</p>
        </footer>
      </div>
    </div>
  );
}
