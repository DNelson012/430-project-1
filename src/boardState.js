const wide = 8;
const tall = 8;
let board;
let revealed;
let mines;

const createBoard = () => {
  board = new Array(wide);
  for (let i = 0; i < wide; i++) {
    board[i] = new Array(tall);
    for (let j = 0; j < tall; j++) {
      board[i][j] = 0;
    }
  }

  revealed = new Array(wide);
  for (let i = 0; i < wide; i++) {
    revealed[i] = new Array(tall);
    for (let j = 0; j < tall; j++) {
      revealed[i][j] = false;
    }
  }
};

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

const isValid = (x, y) => {
  if (x < 0 || x >= wide || y < 0 || y >= tall) {
    return false;
  }
  return true;
};

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

const revealTiles = (x, y) => {
  const values = {};
  const toCheck = [[x, y]];

  if (!isValid(x, y)) {
    return values;
  }

  while (toCheck.length > 0) {
    const tilePos = toCheck.pop();
    const posX = tilePos[0];
    const posY = tilePos[1];
    revealed[posX][posY] = true;

    const num = board[posX][posY];
    values[`${posX},${posY}`] = num;
    if (num === 0) {
      addAdjacent(posX, posY, toCheck);
    }
  }

  return values;
};

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

const getTile = (x, y) => board[x][y];

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
  getTile,
};
