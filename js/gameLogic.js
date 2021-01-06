let angle = 90;
let correctTiles = [];
let wrongTiles = [];
let squares = document.getElementsByClassName("square");
let grid = document.getElementById("grid");
let scoreText = document.getElementById("score");
let attemptTracker = document.getElementById("attempt-text");
attemptTracker.style.visibility = "hidden";

let attemptsLeft = 0;
let score = 0;

const CORRECT_TILE_COLOR = "green";
const WRONG_TILE_COLOR = "red";

const AUDIO_PATH = "./audio/"
const ONE_CORRECT_TILE = "select_1.wav";
const ALL_CORRECT = "all_correct.wav";

const MIN_CORRECT_TILES = 2;
const MAX_CORRECT_TILES = 11;

const MIN_GRID_DIMENSION = 2;
const MAX_GRID_DIMENSION = 7;

const SQUARE_DIMENSION = 50;

let row;
let col;
let numCorrectTiles;

initializeGame();

/**
 * Initializes the game.
 */
function initializeGame() {
  const INITIAL_ROW = 2;
  const INITIAL_COL = 2;
  const INITIAL_CORRECT_TILES = 2;

  row = INITIAL_ROW;
  col = INITIAL_COL;
  numCorrectTiles = INITIAL_CORRECT_TILES;
  
  setGrid(INITIAL_ROW, INITIAL_COL);
  generateSquares(INITIAL_ROW, INITIAL_COL);
  generateCorrectTiles(INITIAL_CORRECT_TILES);
}


/**
 * Calculates the number of correct tiles based on grid size.
 * @param {string} flag. "increase" if all correct tiles were selected.
 *                       "decrease" if wrong tilse were selected.
 */
function updateNumCorrectTiles(flag) {
  if ((flag == "decrease") && (numCorrectTiles > MIN_CORRECT_TILES)) {
      numCorrectTiles--;
  } else if ((flag == "increase") && (numCorrectTiles < MAX_CORRECT_TILES)) {
      numCorrectTiles++;
  }
}


/**
 * Plays the audio.
 * @param {string} audioFileName 
 */
function playSound(audioFileName) {
    const PATH = AUDIO_PATH + audioFileName;
    let sound = new Audio(PATH);
    sound.play();
}


/**
 * Makes the grid unclickable.
 * This function is called whenever the grid is showing the puzzle and when it is rotating.
 */
function toggleGridClickable() {
  grid.style.pointerEvents = "auto";
}


/**
 * Makes the grid clickable.
 * This function is called when the user has to select the correct tiles (after the gird is rotated)
 */
function toggleGridUnclickable() {
  grid.style.pointerEvents = "none";
}


/**
 * Generates squares dynamically onto the grid.
 * @param {int} numRow The number of rows.
 * @param {int} numCol The number of columns.
 */
function generateSquares(numRow, numCol) {
  setTimeout( function() {
    grid.style.visibility ="visible";}, 100);
 
  grid.innerHTML = "";
  
  let squaresToCreate = (numRow * numCol) - squares.length;

  for (let i = 0; i < squaresToCreate; i++) {
    grid.insertAdjacentHTML('beforeend', '<div id=' + i + ' class="square"></div>');
  }
}


/**
 * Sets the dimensions of the grid.
 * @param {int} numRow The number of rows.
 * @param {int} numCol The number of columns.
 */
function setGrid(numRow, numCol) {
  toggleGridUnclickable();
  row = numRow;
  col = numCol;

  grid.style.width = SQUARE_DIMENSION * numRow + "px";
  grid.style.height = SQUARE_DIMENSION * numCol + "px";
}


/**
 * Sets the number of correct tiles.
 * @param {int} numCorrect The number of correct tiles.
 */
function generateCorrectTiles(numCorrect) {
  toggleGridUnclickable();
  correctTiles = [];
  wrongTiles = [];

  while (correctTiles.length != numCorrect) {
    squareID = Math.floor(Math.random() * squares.length);

    if (correctTiles.includes(squareID) == false) {
      initializeCorrectSquares(squareID);
    }
  }
  attemptsLeft = correctTiles.length;
  generateWrongTiles();
  setTimeout(() => setAllGrey(), 3000);
}


/**
 * Sets the onclick function and sets the background to green before rotating.
 * This is a helper function of generateCorrectTiles
 * @param {int} squareID The square id.
 */
function initializeCorrectSquares(squareID) {
  correctTiles.push(squareID);
  squares[squareID].style.background = CORRECT_TILE_COLOR;
  squares[squareID].setAttribute("onclick", "setCorrectColor(" + squareID + ")");
}


/**
 * Generates the wrong tiles.
 * This is a helper function for generateCorrectTiles().
 */
function generateWrongTiles() {
  // Set onclick listeners for each wrong tile
  for (let i = 0; i < squares.length; i++) {
    if (correctTiles.includes(i) == false) {
      squares[i].setAttribute("onclick", "setWrongColor("+i+")");
    }
  }
}


/**
 * Sets the score.
 * @param {int} score 
 */
function setScore(score) {
  scoreText.innerHTML = "SCORE: " + score;
}


/**
 * Sets the onclick attribute for correct tiles.
 * This is a helper function for generateCorrectTiles().
 * @param {int} squareID The id of the square.
 */
function setCorrectColor(squareID) {
  attemptsLeft--;

  setAttemptText();
  removeCorrectSquareFromArray(squareID);
  setSquareColor(squareID, CORRECT_TILE_COLOR);
  setScore(++score);

  if(isAllCorrectTilesSelected()) {
    playSound(ALL_CORRECT);
  } else {
    playSound(ONE_CORRECT_TILE);
  }

  if (attemptsLeft == 0 && wrongTiles.length > 0) {
    toggleGridUnclickable();
    showAnswer();
  }
}


/**
 * Removes square from the correctTiles array.
 * This is a helper function for setCorrectColor.
 * @param {int} squareID 
 */
function removeCorrectSquareFromArray(squareID) {
  index = correctTiles.indexOf(squareID);
  correctTiles.splice(index, 1);
}


/**
 * Checks if all correct tiles have been placed.
 * This is a helper function of setCorrectColor.
 */
function isAllCorrectTilesSelected() {
  if (correctTiles.length == 0) {
    toggleGridUnclickable();
    setTimeout(() => increaseDifficulty(), 1000);
    return true;
  }
  return false;
}


/**
 * Sets the onclick attribute for wrong tiles.
 * @param {int} squareID The id of the square.
 */
function setWrongColor(squareID) {
  attemptsLeft--;
  setScore(--score);
  pushWrongTileToArray(squareID);
  setAttemptText();
  setAttemptTextVisible();

  setSquareColor(squareID, WRONG_TILE_COLOR);
  
  if (score < 0 || attemptsLeft == 0) {
    toggleGridUnclickable();
    showAnswer();
  }  
}


/**
 * Pushes the wrong tile to an array.
 * @param {int} squareID The id of the square
 */
function pushWrongTileToArray(squareID) {
  let square = document.getElementById(squareID)
  wrongTiles.push(square);
}


/**
 * 
 * @param {int} squareID The id of the square/tile.
 * @param {string} color A valid color as a string.
 */
function setSquareColor(squareID, color) {
  let square = document.getElementById(squareID)
  square.style.background = color;
  square.style.pointerEvents = "none";
}


/**
 * Updates the number of attempts left.
 */
function setAttemptText() {
  attemptTracker.innerHTML = "You can select " + attemptsLeft + " more tile(s).";
}


/**
 * Displays the number of attempts left.
 */
function setAttemptTextVisible() {
  attemptTracker.style.visibility = "visible";
}


/**
 * Hides the number of attempts left.
 */
function hideAttemptText() {
  attemptTracker.style.visibility = "hidden";
}


/**
 * Displays the solution after landing on a wrong tile.
 */
function showAnswer(){
  toggleGridUnclickable();
  hideAttemptText();
  for (let i = 0; i < correctTiles.length; i++) {
    let correctTileID = correctTiles[i]
    setSquareColor(correctTileID, CORRECT_TILE_COLOR);
  }

  for (let i = 0; i < wrongTiles; i++) {
    let wrongTileID = wrongTiles[i];
    setSquareColor(wrongTileID, WRONG_TILE_COLOR);
  }
  setTimeout(() => decreaseDifficulty(), 2000);
}


/**
 * Returns true if the board is 2x2.
 * False otherwise.
 */
function isLowestDimension() {
  if ((row == MIN_GRID_DIMENSION) && (col == MIN_GRID_DIMENSION)) {
    return true;
  }
  return false;
}


/**
 * Returns true if the board is 7x7. 
 * False otherwise.
 */
function isGreatestDimension() {
  if ((row == MAX_GRID_DIMENSION) && (col == MAX_GRID_DIMENSION)) {
    return true;
  }
  return false;
}


/**
 * Increaes grid size.
 * This function is called when the user selects all the correct tiles.
 */
function increaseDifficulty() {
  setGridInvisible();
  if (!isGreatestDimension()) {
    if (row < col) {
      setGrid(row+1, col);
    } else {
        setGrid(row, col+1);
      }
  }
  resetGrid("increase");
}


/**
 * Reduces grid size.
 * This function is called when the user clicks on the wrong tile.
 */
function decreaseDifficulty() {
  if (score < 0) {
    redirectToSummaryPage();
  }
  setGridInvisible();
  if (!isLowestDimension()) {
    if (row > col) {
      setGrid(row-1, col);
    } else {
        setGrid(row, col-1);
    }
  }
  resetGrid("decrease");
}


/**
 * Recreates the grid.
 * This function is called when the grid size is changed.
 */
function resetGrid(flag){
  setTimeout(function() {
    generateSquares(row, col);
    grid.style.transition = "all 0.5s";
  }, 1000);
  setTimeout(() => updateNumCorrectTiles(flag), 1005);
  setTimeout(() => generateCorrectTiles(numCorrectTiles), 1050);
 
}

/**
 * Sets grid to hidden and disables animation.
 */
function setGridInvisible() {
  grid.style.transition = "none";
  grid.style.visibility = "hidden";
}


/**
 * Sets all tiles to grey.
 */
function setAllGrey() {
  for (let i = 0; i < squares.length; i++) {
    squares[i].style.background = "grey";
  }
  rotateGrid();
  setTimeout(() => toggleGridClickable(), 500);
  
}


/**
 * Rotates grid by 90 degrees.
 */
function rotateGrid() {
  grid.style.transform = 'rotate('+ angle +'deg)'; 

  angle += 90;
}


/**
 * Store the final score in local memory.
 */
function storeFinalScore() {
  localStorage.setItem("score", score);
}


/**
 * Prompts user if they want to stop playing the game.
 */
function confirmTerminate() {
  if(confirm("Would you like to stop playing?")) {
    redirectToSummaryPage();
  } else {
    // Keep playing
  }
}

/**
 * Redirects page to summary page.
 */
function redirectToSummaryPage() {
  storeFinalScore();
  window.location.href = "summary.html";
}
