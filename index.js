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
  currentGuess: "",
  guesses: [],
  rows: [],
  currentRowIndex: 0,
};
//rows and cols
function buildGameBoard() {
  for (let i = 0; i < game.ROWS; i++) {
    let row = document.createElement("div");
    row.classList.add("row");
    row.setAttribute("data-guess", "");
    gameContainer.appendChild(row);
    for (let j = 0; j < game.COLS; j++) {
      let tile = document.createElement("div");
      tile.classList.add("tile");
      tile.textContent = "a";
      row.appendChild(tile);
    }
  }
}
buildGameBoard();
game.rows = [...document.querySelectorAll(".row")];
let activeRow = game.rows[game.currentRowIndex];
console.log(activeRow);

window.addEventListener("keydown", handleKeyDown);

function handleKeyDown(e) {
  console.log("wtf");
}
