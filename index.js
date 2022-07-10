let words = ["horse", "pants", "party", "music"];

const generateRandomNumber = () => {
  return Math.floor(Math.random() * words.length);
};
let staticIndex = 1;

let todaysWord = !staticIndex
  ? words[generateRandomNumber()]
  : words[staticIndex];
// game variables and initial selectors
const gameContainer = document.querySelector(".game-container");
const alertContainer = gameContainer.querySelector(".alert-container");
let game = {
  ROWS: 6,
  WORD_LENGTH: 5,
  FLIP_ANIMATION_DURATION: 500,
  word: [],
  currentGuess: "",
  guesses: [],
  currentRowIndex: 0,
  state: false,
};
function startGame() {
  game.state = true;
  window.addEventListener("keydown", handleKeyDown);
}
function stopGame() {
  game.state = false;
  window.removeEventListener("keydown", handleKeyDown);
}
function buildGameBoard() {
  for (let i = 0; i < game.ROWS; i++) {
    let row = document.createElement("div");
    row.classList.add("row");

    gameContainer.appendChild(row);
    for (let j = 0; j < game.WORD_LENGTH; j++) {
      let tile = document.createElement("div");
      tile.classList.add("tile");
      tile.dataset.state = "empty";
      row.appendChild(tile);
    }
  }
}
buildGameBoard();
startGame();
game.rows = [...gameContainer.querySelectorAll(".row")];

function handleKeyDown(e) {
  let activeRow = getActiveRow();
  let key = e.key.toLowerCase();
  if (key === "enter") {
    submitGuess(activeRow);
    return;
  }
  if (key === "backspace") {
    deleteKey(activeRow);
    return;
  }
  if (key.match(/^[a-z]$/)) {
    startGame();
    spreadLetters(key, activeRow);
    return;
  }
}
function spreadLetters(key, row) {
  let { word, WORD_LENGTH } = game;
  let currentTile = row.querySelector('[data-state="empty"]');
  if (!currentTile || word.length == WORD_LENGTH)
    return console.log("filled all");
  currentTile.dataset.letter = key;
  currentTile.dataset.state = "active";
  word.push(key);
  row.dataset.word = word.reduce((acc, tile) => {
    return acc + tile;
  }, "");
  console.log(row, game.currentGuess, word);
}
function getActiveRow() {
  return gameContainer.querySelectorAll(".row")[game.currentRowIndex];
}
function getCurrentGuess(row) {
  return (game.currentGuess = row.dataset.word);
}

function deleteKey(activeRow) {
  let activeTiles = activeRow.querySelectorAll('[data-state="active"]');
  let lastTile = activeTiles[activeTiles.length - 1];
  if (!lastTile) return;
  delete lastTile.dataset.letter;
  lastTile.dataset.state = "empty";
  game.word = game.word.slice(0, -1);
  let prev = activeRow.dataset.word.slice(0, -1);
  activeRow.dataset.word = prev;
}

function submitGuess(activeRow) {
  const { currentRowIndex, WORD_LENGTH } = game;
  getCurrentGuess(activeRow);
  if (!game.currentGuess || game.currentGuess.length < WORD_LENGTH)
    return showAlert("not enough letter");
  else {
    let tiles = [...activeRow.querySelectorAll("[data-letter]")];
    tiles.forEach((tile, i) => flipTile(tile, i));
    game.currentRowIndex = currentRowIndex + 1;
    game.currentGuess = "";
    game.word = [];
  }
}

function showAlert(message, duration = 1000) {
  let alert = document.createElement("div");
  alert.className = "alert";
  alert.textContent = message;
  alertContainer.prepend(alert);
  if (duration == null) return;
  setTimeout(() => {
    alert.classList.add("hide");
    alert.addEventListener("transitionend", () => {
      alert.remove();
    });
  }, duration);
}

function flipTile(tile, i) {
  if (todaysWord[i] === tile.dataset.letter) {
    tile.dataset.state = "correct";
  } else if (todaysWord.includes(tile.dataset.letter)) {
    tile.dataset.state = "close";
  } else {
    tile.dataset.state = "wrong";
  }
}
