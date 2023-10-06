const wide = 8;
const tall = 8;
let board;
let mines;

const setMines = () => {
  mines = [];
  mines.push({ x: 1, y: 1 });
  mines.push({ x: 5, y: 0 });
  mines.push({ x: 5, y: 1 });
  mines.push({ x: 5, y: 3 });
};

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

const createBoard = () => {
  board = new Array(wide);
  for (let i = 0; i < wide; i++) {
    board[i] = new Array(tall);
    for (let j = 0; j < tall; j++) {
      board[i][j] = 0;
    }
  }
};

const init = () => {
  createBoard();

  setMines();
  calcNums();
};

const getBoard = () => {

}

const getTile = (x, y) => {
  let values = {};
  if (x < 0 || x >= wide || y < 0 || y >= tall) {
    return values;
  }
  let num = board[x][y];
  values[`${x},${y}`] = num;
  
  /*
  let toCheck = [];
  if (num === 0) {
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
  */

  return board[x][y];
};

module.exports = {
  init,
  createBoard,
  getBoard,
  getTile,
};
