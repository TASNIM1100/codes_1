const board = document.getElementById("board");
const status = document.getElementById("status");
const modeButtons = document.getElementById("modeButtons");
const chooseFirstContainer = document.getElementById("chooseFirstContainer");
const gameArea = document.getElementById("gameArea");
const scoreboard = document.getElementById("scoreboard");
const homeBtn = document.getElementById("homeBtn");

let currentPlayer = "X";
let gameMode = null;
let gameBoard = Array(9).fill(null);
let isGameOver = false;
let scores = {
  X: 0,
  O: 0,
  Draw: 0
};
let toggleStartingPlayer = true; // Keeps track of whose turn it is to start

function startGame(mode) {
  gameMode = mode;

  // Hide homepage elements
  modeButtons.style.display = "none";
  chooseFirstContainer.style.display = "none";

  // Show the game page
  chooseFirstContainer.style.display = "flex";

  // Remove the home-page class and add game-page class
  document.body.classList.remove("home-page");
  document.body.classList.add("game-page");

  chooseFirstContainer.innerHTML = `
    <p id="turnPrompt">Who Should Start First ?</p>
    <div id="starterButtons">
      <button onclick="chooseFirst('X')">${mode === "computer" ? "You" : "Player 1  ( X )"}</button>
      <button onclick="chooseFirst('O')">${mode === "computer" ? "Computer" : "Player 2  ( O )"}</button>
    </div>
  `;
}

function chooseFirst(player) {
  currentPlayer = player;
  chooseFirstContainer.style.display = "none";
  homeBtn.style.display = "inline-block";
  gameArea.style.display = "flex";
  createBoard();
  updateScoreboard();
  if (gameMode === "computer" && currentPlayer === "O") {
    setTimeout(computerMove, 800); // Computer makes the first move
  }
}

function createBoard() {
  board.innerHTML = "";
  gameBoard = Array(9).fill(null);
  isGameOver = false;
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleMove);
    board.appendChild(cell);
  }
  status.textContent = `${currentPlayer === "X" ? "X's" : "O's"} Turn`;
}

function handleMove(e) {
  const index = e.target.dataset.index;
  if (isGameOver || gameBoard[index]) return;
  gameBoard[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  checkWinOrDraw();
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  if (!isGameOver) {
    status.textContent = `${currentPlayer === "X" ? "X's" : "O's"} Turn`;
    if (gameMode === "computer" && currentPlayer === "O") {
      setTimeout(computerMove, 800);
    }
  }
}

function computerMove() {
  let bestMove = getBestMove(gameBoard);
  const cell = board.querySelector(`[data-index='${bestMove}']`);
  cell.click();
}

function getBestMove(board) {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

function minimax(board, depth, isMaximizing) {
  const winner = checkWinner(board);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (board.every(cell => cell !== null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const [a, b, c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function checkWinOrDraw() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const [a, b, c] of winPatterns) {
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      status.textContent = `${gameBoard[a]} Wins! 🎉`;
      scores[gameBoard[a]]++;
      isGameOver = true;
      updateScoreboard();

      const winningCells = [a, b, c].map(index => board.querySelector(`[data-index='${index}']`));
      winningCells.forEach(cell => cell.classList.add("winning-cell"));

      return;
    }
  }

  if (!gameBoard.includes(null)) {
    status.textContent = "It's a Draw!";
    scores.Draw++;
    isGameOver = true;
    updateScoreboard();
  }
}

function restartGame() {
  // Toggle the starting player
  currentPlayer = toggleStartingPlayer ? "O" : "X";
  toggleStartingPlayer = !toggleStartingPlayer;

  isGameOver = false; // Reset game state
  createBoard();
  if (gameMode === "computer" && currentPlayer === "O") {
    setTimeout(computerMove, 800); // Ensure computer moves immediately if it's their turn
  }
}

function updateScoreboard() {
  const labelX = gameMode === "computer" ? "You (X)" : "Player 1 (X)";
  const labelO = gameMode === "computer" ? "Computer (O)" : "Player 2 (O)";
  scoreboard.innerHTML = `
    <div>${labelX}: ${scores.X}</div>
    <div>${labelO}: ${scores.O}</div>
    <div>Draws: ${scores.Draw}</div>
  `;
}


function goHome() {
  location.reload();
}