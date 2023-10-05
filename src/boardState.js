const wide = 8;
const tall = 8;
let board;
let mines;

const setMines = () => {
  mines = new Array();
  mines.push({ x: 1, y: 1 });
  mines.push({ x: 5, y: 0 });
  mines.push({ x: 5, y: 1 });
  mines.push({ x: 5, y: 3 });
};

const calcNums = () => {
  for (let i = 0; i < mines.length; i++) {
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        // Add a lot to itself
        //if (xOffset === 0 && yOffset === 0) { continue; }
        if (xOffset === 0 && yOffset === 0) { 
          board[mines[i].x][mines[i].y] += 10;
          continue; 
        }

        let xAdjacent = mines[i].x + xOffset;
        let yAdjacent = mines[i].y + yOffset;
        // Skip any tiles that would be off the board
        if (xAdjacent < 0 || xAdjacent >= wide) { continue; }
        if (yAdjacent < 0 || yAdjacent >= tall) { continue; }

        // Increment its mine count
        board[xAdjacent][yAdjacent] += 1;
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

const getTile = (x, y) => {
  if (board) {
    return board[x][y];
  }
}

module.exports = {
  init,
  createBoard,
  getTile,
};
