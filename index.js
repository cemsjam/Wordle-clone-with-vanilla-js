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

let game = {
  ROWS: 6,
  COLS: 5,
  currentGuess: [],
  guesses: [],
  rows: [],
  currentRowIndex: 0,
  state: true,
};

function buildGameBoard() {
  for (let i = 0; i < game.ROWS; i++) {
    let row = document.createElement("div");
    row.classList.add("row");

    gameContainer.appendChild(row);
    for (let j = 0; j < game.COLS; j++) {
      let tile = document.createElement("div");
      tile.classList.add("tile");
      tile.dataset.state = "empty";
      row.appendChild(tile);
    }
  }
}
buildGameBoard();
game.rows = [...document.querySelectorAll(".row")];

if (game.state) {
  window.addEventListener("keydown", handleKeyDown);
}

function handleKeyDown(e) {
  const { rows, currentRowIndex, COLS, currentGuess } = game;
  let activeRow = rows[currentRowIndex];
  let tiles = [...activeRow.children];
  let pressedKey = e.key.toLowerCase();
  console.log(currentGuess.length);
  if (currentGuess.length == COLS) {
    return (activeRow.dataset.word = currentGuess.join(""));
  }
  if (pressedKey == "enter") {
    if (!activeRow.dataset.word) {
      return;
    } else {
      submitGuess(activeRow);
    }
  }

  spreadLetters(pressedKey, tiles);
}

function spreadLetters(key, tiles) {
  let { currentGuess } = game;

  currentGuess.push(key);
  for (let i = 0; i < currentGuess.length; i++) {
    tiles[i].dataset.letter = currentGuess[i];
    tiles[i].dataset.state = "focus";
  }

  console.log(currentGuess);
}

function submitGuess(activeRow) {
  console.log(activeRow.dataset.word == todaysWord);
  if (activeRow.dataset.word == todaysWord) {
    console.log("you won");
  }
}
