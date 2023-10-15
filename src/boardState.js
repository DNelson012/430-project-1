// Constants
const wide = 8;
const tall = 8;
const mineQty = 9;

// Globals
let board;
let revealed;
let numHidden;
let mines;
let firstMove;
let indices; // Really shouldn't be, but its useful
let gameState;

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
  // Turns on the flag saying the game is over
  gameState = 'LOSE';

  // Fill an object with all the tiles on the board
  const values = {};
  for (let i = 0; i < tall * wide; i++) {
    const x = i % wide;
    const y = Math.floor(i / tall);
    let num = board[x][y];
    if (num >= 100) { num -= 100; } // Remove flags
    values[`${x},${y}`] = num;
  }

  // Again, doesn't actually go anywhere
  // I might do something with this later though
  return values;
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
const findMines = (x, y) => {
  for (let i = 0; i < mines.length; i++) {
    if (Number(mines[i].x) === Number(x)
    && Number(mines[i].y) === Number(y)) {
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

  // Check if the tile is a mine
  const mineIndex = findMines(x, y);
  // Check if the tile is flagged
  const isFlagged = board[x][y] >= 100;
  if (mineIndex >= 0 && !isFlagged) {
    if (firstMove) {
      // If your first move is to click on a mine, move the mine
      // Delete old mine
      mines.splice(mineIndex, 1);
      board[x][y] -= 10;
      // Take a random index from that indices array from before
      // It only has indices that do NOT contain mines
      const rand = Math.floor(Math.random() * indices.length);
      const index = indices.splice(rand, 1);
      // Make a new mine with that index
      const mineX = index % wide;
      const mineY = Math.floor(index / tall);
      mines.push({ x: mineX, y: mineY });
      // Recalculate numbers
      createBoard();
      calcNums();
    } else {
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

    if (!revealed[posX][posY]) {
      // Decrement hidden count
      numHidden--;
    }
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
  if (numHidden <= mineQty) {
    gameState = 'WIN';
  }
  // Return all the values that were revealed
  //  Currently doesn't do anything with return
  return values;
};

// Flags a tile on the board,
// preventing it from being revealed
const flagTile = (x, y) => {
  let mod = 1;
  if (board[x][y] >= 100) { mod = -1; }
  board[x][y] += mod * 100;
};

// Returns an object that has all revealed tiles
//  in the form -> 'x,y': value
const getBoard = () => {
  const values = {};
  if (gameState !== 'PLAY') {
    values.state = gameState;
  }
  for (let i = 0; i < wide; i++) {
    for (let j = 0; j < tall; j++) {
      let num = board[i][j];
      if (gameState === 'LOSE' || revealed[i][j] || num >= 100) {
        // Remove flags when its game over
        if (gameState === 'LOSE' && num >= 100) { num -= 100; }
        values[`${i},${j}`] = num;
      }
    }
  }

  return values;
};

// Returns the number of mines in the given quad
const getHint = (quadStr) => {
  const quad = Number(quadStr); // I love javascript
  let xLow = -1; // Inclusive
  let xHigh = -1; // Exclusive
  let yLow = -1;
  let yHigh = -1;
  switch (quad) {
    case 1:
      xLow = 4; xHigh = 8;
      yLow = 0; yHigh = 4;
      break;
    case 2:
      xLow = 0; xHigh = 4;
      yLow = 0; yHigh = 4;
      break;
    case 3:
      xLow = 0; xHigh = 4;
      yLow = 4; yHigh = 8;
      break;
    default:
      // Default is 4. The data is already sanitized,
      // so it should only ever be 4 if not 1, 2, or 3
      xLow = 4; xHigh = 8;
      yLow = 4; yHigh = 8;
      break;
  }

  let numMines = 0;
  for (let x = xLow; x < xHigh; x++) {
    for (let y = yLow; y < yHigh; y++) {
      let num = board[x][y];
      if (num >= 100) { num -= 100; } // Ignore flags
      // If it is a mine, increment the count
      if (num >= 10) {
        numMines++;
      }
    }
  }

  return numMines;
};

// Initialization
const init = () => {
  firstMove = true;
  numHidden = wide * tall;
  gameState = 'PLAY';
  createBoard();

  setMines(mineQty);
  calcNums();
};

// Reset the board
// Just call init again, should work fine
const resetBoard = () => {
  init();
};

module.exports = {
  init,
  createBoard,
  isValid,
  revealTiles,
  flagTile,
  getBoard,
  getHint,
  resetBoard,
};

/*
// Gets the number value of a given tile
// Not currently used
const getTile = (x, y) => board[x][y];
*/
