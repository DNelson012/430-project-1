// Constants
const wide = 8;
const tall = 8;

// Globals
let board;
let revealed;
let mines;
let firstMove;
let indices; // Really shouldn't be, but its useful

// Initializes the arrays for the state of the board
const createBoard = () => {
  // Board stores the values of each tile
  //  More than 10 is a mine
  //  More than 100 is a flag
  board = new Array(wide);
  for (let i = 0; i < wide; i++) {
    board[i] = new Array(tall);
    for (let j = 0; j < tall; j++) {
      board[i][j] = 0;
    }
  }

  // Revealed stores which tiles have been revealed
  revealed = new Array(wide);
  for (let i = 0; i < wide; i++) {
    revealed[i] = new Array(tall);
    for (let j = 0; j < tall; j++) {
      revealed[i][j] = false;
    }
  }
};

// Set the initial mines for the board
const setMines = (num) => {
  mines = [];
  const numTiles = wide * tall;

  // Make an array of all possible tile indices
  // https://stackoverflow.com/questions/3751520/how-to-generate-sequence-of-numbers-chars-in-javascript
  indices = Array(numTiles).fill().map((element, index) => index);

  // For the number given, randomly place that many mines
  for (let i = 0; i < num; i++) {
    let index = Math.floor(Math.random() * (numTiles - i));
    index = indices.splice(index, 1);
    const x = index % wide;
    const y = Math.floor(index / tall);
    mines.push({ x, y });
  }

  console.log(mines);
};

// Calculate the number value for each tile
// Iterates over the mines array and adds values to adjacent tiles
//  Adds 10 to itself to indicate that it is a mine
// Should only be needed at initialization
const calcNums = () => {
  for (let i = 0; i < mines.length; i++) {
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        const xAdjacent = mines[i].x + xOffset;
        const yAdjacent = mines[i].y + yOffset;

        // Add a lot to itself, anything above 10 is a mine
        if (xOffset === 0 && yOffset === 0) {
          board[mines[i].x][mines[i].y] += 10;
        } else if (xAdjacent >= 0 && xAdjacent < wide && yAdjacent >= 0 && yAdjacent < tall) {
          // Increment its mine count, skipping anything off the board
          board[xAdjacent][yAdjacent] += 1;
        }
      }
    }
  }
};

// A mine was clicked and the game must end
// Needs to return the whole board, 
// and then something saying the player lost
const gameOver = () => {

};

// Checks if the given position is a valid tile on the board
//  Returns false if it is not, true otherwise
const isValid = (x, y) => {
  if (x < 0 || x >= wide || y < 0 || y >= tall) {
    return false;
  }
  return true;
};

// Loops through all the mines,
// returns the index in the mines array
// -1 if it isn't there
const checkMines = (x, y) => {
  for (let i = 0; i < mines.length; i++) {
    if (Number(mines[i].x) === Number(x) && Number(mines[i].y) === Number(y)) {
      return i;
    }
  }
  return -1;
};

// Helper method for revealTiles()
// Checks if a tile is valid and hidden before adding to an array
const addAdjacent = (x, y, arr) => {
  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const xAdjacent = +x + xOffset;
      const yAdjacent = +y + yOffset;

      if (isValid(xAdjacent, yAdjacent)
        && !revealed[xAdjacent][yAdjacent]) {
        arr.push([xAdjacent, yAdjacent]);
      }
    }
  }
};

// Reveals at least one tile on the board
//  also reveals all tiles around any 0 value tile
//  that had been revealed during this function call
const revealTiles = (x, y) => {
  const values = {}; // Tiles to return -> 'x,y': value
  const toCheck = [[x, y]]; // Tiles that need to be revealed

  // If the first position is not valid, just return nothing early
  if (!isValid(x, y)) {
    return values;
  }

  // Check if the tile is a mine
  const mineIndex = checkMines(x, y);
  if (mineIndex >= 0) {
    if (firstMove) {
      // If your first move is to click on a mine, move the mine
      // Delete old mine
      delete mines[mineIndex];
      board[x][y] = board[x][y] - 10;
      // Take a random index from that indices array from before
      // It only has indices that do NOT contain mines
      const rand = Math.floor(Math.random() * indices.length);
      const index = indices.splice(rand, 1);
      // Make a new mine with that index
      const mineX = index % wide;
      const mineY = Math.floor(index / tall);
      mines.push({ mineX, mineY });
    }
    else {
      // Otherwise, you clicked on a mine and you lost
      return gameOver();
    }
  }

  // As long as there are tiles to check, keep iterating
  while (toCheck.length > 0) {
    // Take out one of the positions from the array
    const tilePos = toCheck.pop();
    const posX = tilePos[0];
    const posY = tilePos[1];

    // Don't reveal flagged tiles

    // Reveal the tile
    revealed[posX][posY] = true;

    // If the revealed tile is a zero,
    // add every adjacent value to the toCheck array
    const num = board[posX][posY];
    values[`${posX},${posY}`] = num;
    if (num === 0) {
      addAdjacent(posX, posY, toCheck);
    }
  }

  // You only move first once
  if (firstMove) { firstMove = false; }

  // Check if the only tiles left are mines

  // Return all the values that were revealed
  return values;
};

// Returns an object that has all revealed tiles
//  in the form -> 'x,y': value
const getBoard = () => {
  const values = {};
  for (let i = 0; i < wide; i++) {
    for (let j = 0; j < tall; j++) {
      if (revealed[i][j]) {
        values[`${i},${j}`] = board[i][j];
      }
    }
  }

  return values;
};

// Initialization
const init = () => {
  firstMove = true;
  createBoard();

  setMines(9);
  calcNums();
};

module.exports = {
  init,
  createBoard,
  isValid,
  revealTiles,
  getBoard,
};

/*
// Gets the number value of a given tile
// Not currently used
const getTile = (x, y) => board[x][y];
*/
