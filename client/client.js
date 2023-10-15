// Constants
let boardWidth;
let boardHeight;

// Globals
let content;
let gameState;

// Parse the response and display its body
//  and do anything else that is needed to update the board
const handleResponse = async (response, method) => {
  // Display the status code
  switch (response.status) {
    case 200:
      content.innerHTML += '<p><b>Success</b></p>';
      break;
    case 201:
      content.innerHTML += '<p><b>Created</b></p>';
      break;
    case 204:
      content.innerHTML += '<p><b>Updated (No Content)</b></p>';
      break;
    case 400:
      content.innerHTML += '<p><b>Bad Request</b></p>';
      break;
    case 404:
      content.innerHTML += '<p><b>Not Found</b></p>';
      break;
    default:
      content.innerHTML += '<p>Error code not implemented by client.</p>';
      break;
  }

  // If the response was from a GET,
  //  display the message
  if (method === "GET") {
    const json = await response.json();

    let jsonStr = "";
    if (json.message) {
      jsonStr = `Message: ${json.message}`;
    }
    content.innerHTML += `<p>${jsonStr}</p>`;

    updateBoard(json.board);
  }

  // If a POST request was made to the server,
  //  make a request to get the state of the board
  if (method === "POST") {
    getBoard();
  }

  content.innerHTML += '<hr>';
};

// Send the tile to reveal in a POST request
const postRevealTile = async (x, y) => {
  // Build a data string in the FORM-URLENCODED format.
  const data = `xPos=${x}&yPos=${y}`;

  const response = await fetch('/revealTile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: data,
  });

  handleResponse(response, 'POST'); 
};

// Send the tile to reveal in a POST request
const postFlagTile = async (x, y) => {
  // Build a data string in the FORM-URLENCODED format.
  const data = `xPos=${x}&yPos=${y}`;

  const response = await fetch('/flagTile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: data,
  });

  handleResponse(response, 'POST');
};

// Resets the game, starting with a new board
const postResetBoard = async () => {
  const response = await fetch('/resetBoard', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });
  
  // Make a new board after
  createBoard();

  handleResponse(response, 'POST~'); 
  // It is a POST, but I don't want it fetching the board
  // When it is always going to get {} back
}

// Get the current board state from the server
const getBoard = async () => {
  const response = await fetch('/getBoard', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  handleResponse(response, 'GET');
};

const getHint = async () => {
  
}

// Given a tile's x and y position and a number,
//  reveal the tile at the position 
//  and replace its text with the given number
const revealTile = (x, y, num) => {
  const tile = board.childNodes[Number(x) + boardWidth * Number(y)];

  // If the tile was flagged, don't do anything else
  // besides change how it looks
  if (num >= 100) {
    tile.classList.add("flag");
    return;
  }

  // Change from hidden to revealed
  // Do not allow further clicking
  tile.classList.remove("hidden");
  tile.classList.add("revealed");
  tile.removeEventListener("click", clickTile);

  // Set the number of the inside text
  const inner = tile.childNodes[0];
  inner.textContent = num;

  // If its a mine, set it to look like one
  if (num >= 10) {
    if (gameState === 'WIN') {
      // If the game is won, mines appear as flags
      tile.classList.add("flag");
    } else {
      // Otherwise, mines look like mines
      tile.classList.add("mine");
    }
  }

  // If the game was lost, remove each flags
  if (gameState === 'LOSE') {
    tile.classList.remove("flag");
  }
}

const gameLost = () => {

}
const gameWon = () => {
  
}

// Given an object containing a dictionary of tile coords and numbers,
//  reveal the respective tiles on the board
//  and make them display the correct number
const updateBoard = (board) => {
  let boardTiles = Object.keys(board);
  if (board.state === "LOSE") {
    gameState = board.state;
    gameLost();
    delete board.state;
    boardTiles = Object.keys(board);
  } else if (board.state === "WIN") {
    gameState = board.state;
    gameWon();
    delete board.state;
    boardTiles = Object.keys(board);
  }
  for (let i = 0; i < boardTiles.length; i++) {
    const num = board[boardTiles[i]];
    const pos = boardTiles[i].split(',');
    revealTile(pos[0], pos[1], num);
  }
}

// Callback function for when a tile is clicked on
const clickTile = (element) => {
  const tile = element.currentTarget;

  // Adds a slight flash when a tile is clicked
  tile.classList.add("flash");
  setTimeout(() => { tile.classList.remove("flash"); }, 300);
  
  const x = tile.getAttribute("data-x");
  const y = tile.getAttribute("data-y");

  if (element.ctrlKey) {
    // If the user is holding Ctrl, flag the tile
    tile.classList.remove("flag");
    postFlagTile(x, y);
  } else {
    // Otherwise, reveal the tile
    postRevealTile(x, y);
  }
  return;
}

// Creates the board in HTML
const createBoard = () => {
  const board = document.querySelector('#board');
  board.innerHTML = "";

  for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardHeight; j++) {
      let element = document.createElement("div");
      element.classList.add("tile");
      element.classList.add("hidden");

      element.setAttribute("data-x", j);
      element.setAttribute("data-y", i);

      element.addEventListener("click", clickTile);

      let innerElem = document.createElement("div");
      innerElem.classList.add("tileContent");
      innerElem.textContent = `${j}${i}`;

      element.appendChild(innerElem);
      board.appendChild(element);
    }
  }
}

// Initialization
const init = () => {
  content = document.querySelector("#content div");
  gameState = 'PLAY';

  boardWidth = 8;
  boardHeight = 8;

  createBoard();
  getBoard();

  // Sets up the reset button
  document.querySelector("#reset").addEventListener('click', postResetBoard);
  // Sets up the hint buttons
  document.querySelector("#quad1").addEventListener('click', postResetBoard);
  document.querySelector("#quad2").addEventListener('click', postResetBoard);
  document.querySelector("#quad3").addEventListener('click', postResetBoard);
  document.querySelector("#quad4").addEventListener('click', postResetBoard);

  // Taken from a Medium article, disables right click context menu on the board
  document.querySelector('#board').addEventListener('contextmenu', event => {
    event.preventDefault();
  });
};

window.onload = init;
