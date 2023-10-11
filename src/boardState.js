// Constants
const wide = 8;
const tall = 8;

// Globals
let board;
let revealed;
let mines;
// bool for if a first move was made

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
const setMines = () => {
  mines = [];
  mines.push({ x: 1, y: 1 });
  mines.push({ x: 5, y: 0 });
  mines.push({ x: 5, y: 1 });
  mines.push({ x: 5, y: 3 });
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

// Checks if the given position is a valid tile on the board
//  Returns false if it is not, true otherwise
const isValid = (x, y) => {
  if (x < 0 || x >= wide || y < 0 || y >= tall) {
    return false;
  }
  return true;
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

  // As long as there are tiles to check, keep iterating
  while (toCheck.length > 0) {
    // Take out one of the positions from the array
    const tilePos = toCheck.pop();
    const posX = tilePos[0];
    const posY = tilePos[1];
    revealed[posX][posY] = true;

    // If the revealed tile is a zero,
    // add every adjacent value to the toCheck array
    const num = board[posX][posY];
    values[`${posX},${posY}`] = num;
    if (num === 0) {
      addAdjacent(posX, posY, toCheck);
    }
  }

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
  createBoard();

  setMines();
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
