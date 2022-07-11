//#region PRETEND FETCH

let words = ["horse", "pants", "party", "music"];

const generateRandomNumber = () => {
  return Math.floor(Math.random() * words.length);
};
let staticIndex = 1;

let todaysWord = !staticIndex
  ? words[generateRandomNumber()]
  : words[staticIndex];

//#endregion

// #region GAME VARIABLES AND GENERAL SELECTORS
const BACKSPACE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
<path fill="var(--color-tone-1)" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
</svg>`;
const gameContainer = document.querySelector(".game-container");
const alertContainer = gameContainer.querySelector(".alert-container");
const keyboardContainer = document.querySelector(".keyboard-container");

const ROWS = 6;
const WORD_LENGTH = 5;
let word = [];
let currentGuess;
let guesses = [];
let currentRowIndex = 0;
let state = false;
let isLost = false;

//#endregion

//#region BUILD GAME BOARD

function buildGameBoard() {
  for (let i = 0; i < ROWS; i++) {
    let row = document.createElement("div");
    row.classList.add("row");

    gameContainer.appendChild(row);
    for (let j = 0; j < WORD_LENGTH; j++) {
      let tile = document.createElement("div");
      tile.classList.add("tile");
      tile.dataset.state = "empty";

      row.appendChild(tile);
    }
  }
}

//#endregion

function startGame() {
  state = true;
  window.addEventListener("keydown", handleKeyDown);
  keyboardContainer.addEventListener("click", handleClick);
}
function stopGame() {
  state = false;
  window.removeEventListener("keydown", handleKeyDown);
  keyboardContainer.removeEventListener("click", handleClick);
}

//#region onload FN & SELECTORS

buildGameBoard();
startGame();
rows = [...gameContainer.querySelectorAll(".row")];
function getActiveRow() {
  return gameContainer.querySelectorAll(".row")[currentRowIndex];
}
function getCurrentGuess(row) {
  return (currentGuess = row.dataset.word);
}
//#endregion

//#region KEY HANDLER

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
function handleClick(e) {
  let activeRow = getActiveRow();

  if (e.target.matches(`[data-key="enter"]`)) {
    submitGuess(activeRow);
    return;
  }
  if (e.target.matches(`[data-key="backspace"]`)) {
    deleteKey(activeRow);
    return;
  }
  if (e.target.matches(`[data-key]`)) {
    let key = e.target.dataset.key;
    startGame();
    spreadLetters(key, activeRow);
    return;
  }
}

//#endregion

//#region SPREAD LETTERS FN

function spreadLetters(key, row) {
  let currentTile = row.querySelector('[data-state="empty"]');
  if (!currentTile || word.length == WORD_LENGTH) return;
  currentTile.dataset.letter = key;
  currentTile.dataset.state = "active";
  currentTile.classList.add("active");
  currentTile.addEventListener(
    "animationend",
    () => {
      currentTile.classList.remove("active");
    },
    { once: true }
  );
  word.push(key);
  row.dataset.word = word.reduce((acc, tile) => {
    return acc + tile;
  }, "");
}

//#endregion

//#region SUBMIT GUESS
function submitGuess(activeRow) {
  getCurrentGuess(activeRow);
  if (!currentGuess || currentGuess.length < WORD_LENGTH) {
    shakeTiles(activeRow);
    showAlert("not enough letter");
    return;
  } else if (!words.includes(currentGuess)) {
    showAlert("Not In Words List", 2000);
    shakeTiles(rows[currentRowIndex]);
    return;
  } else {
    let tiles = [...activeRow.querySelectorAll("[data-letter]")];
    tiles.forEach((tile, i) => flipTile(tile, i));
    guesses.push(currentGuess);
  }
}

//#endregion

//#region FLIP ANIMATION LISTENER

function flipTile(tile, i) {
  let letter = tile.dataset.letter;
  let key = keyboardContainer.querySelector(`[data-key="${letter}"]`);
  tile.classList.add("flipped");
  stopGame();
  tile.addEventListener(
    "transitionend",
    () => {
      tile.classList.remove("flipped");
      if (todaysWord[i] === letter) {
        tile.dataset.state = "correct";
        key.dataset.state = "correct";
      } else if (todaysWord.includes(letter)) {
        tile.dataset.state = "close";
        key.dataset.state = "close";
      } else {
        tile.dataset.state = "wrong";
        key.dataset.state = "wrong";
      }
      if (i === WORD_LENGTH - 1) {
        startGame();
        checkWinOrLose();
      }
    },
    { once: true }
  );
}

//#endregion

//#region CHECKING IF GAME IS WON OR LOST

function checkWinOrLose() {
  if (todaysWord == currentGuess) {
    showAlert("You Win", 5000);
    stopGame();
    return;
  }

  if (guesses.length == ROWS) {
    showAlert(todaysWord, null);
    isLost = true;
    stopGame();
    return;
  } else {
    currentRowIndex = currentRowIndex + 1;
    currentGuess = "";
    word = [];
    return;
  }
}

//#endregion

//#region DELETE LETTER

function deleteKey(activeRow) {
  let activeTiles = activeRow.querySelectorAll('[data-state="active"]');
  let lastTile = activeTiles[activeTiles.length - 1];
  if (!lastTile) return;
  delete lastTile.dataset.letter;
  lastTile.dataset.state = "empty";
  word = word.slice(0, -1);
  let prev = activeRow.dataset.word.slice(0, -1);
  activeRow.dataset.word = prev;
}

//#endregion

//#region ALERT WIDGET

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

//#endregion

function shakeTiles(el) {
  el.classList.add("shake");
  el.addEventListener(
    "animationend",
    () => {
      el.classList.remove("shake");
    },
    { once: true }
  );
}

function buildKeyboard() {
  buildKeyboardRow("qwertyuiop", false);
  buildKeyboardRow("asdfghjkl", false);
  buildKeyboardRow("zxcvbnm", true);
}
buildKeyboard();
function buildKeyboardRow(letters, isLastRow) {
  let row = document.createElement("div");
  row.classList.add("keyboard-row");
  if (isLastRow) {
    let button = document.createElement("button");
    button.classList.add("keyboard-btn");
    button.textContent = "enter";
    button.dataset.key = "enter";
    button.onclick = () => {};
    row.appendChild(button);
  }
  for (let letter of letters) {
    let button = document.createElement("button");
    button.classList.add("keyboard-btn");
    button.textContent = letter;
    button.dataset.key = letter;
    button.onclick = () => {};
    row.appendChild(button);
  }
  if (isLastRow) {
    let button = document.createElement("button");
    button.classList.add("keyboard-btn");
    button.innerHTML = BACKSPACE_ICON;
    button.dataset.key = "backspace";
    button.onclick = () => {};
    row.appendChild(button);
  }
  keyboardContainer.appendChild(row);
}
