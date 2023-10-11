// Constants
let boardWidth;
let boardHeight;

// Globals
let content;

// Parse the response and display its body
//  and do anything else that is needed to update the board
const handleResponse = async (response, method) => {
  // Display the status code
  switch (response.status) {
    case 200:
      content.innerHTML = '<b>Success</b>';
      break;
    case 201:
      content.innerHTML = '<b>Created</b>';
      break;
    case 204:
      content.innerHTML = '<b>Updated (No Content)</b>';
      break;
    case 400:
      content.innerHTML = '<b>Bad Request</b>';
      break;
    case 404:
      content.innerHTML = '<b>Not Found</b>';
      break;
    default:
      content.innerHTML = 'Error code not implemented by client.';
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

// Given a tile's x and y position and a number,
//  reveal the tile at the position 
//  and replace its text with the given number
const revealTile = (x, y, num) => {
  const tile = board.childNodes[Number(x) + boardWidth * Number(y)];

  tile.classList.remove("hidden");
  tile.classList.add("revealed");
  tile.removeEventListener("click", clickTile);

  const inner = tile.childNodes[0];
  inner.textContent = num;

  if (num > 9) {
    tile.classList.add("mine");
  }
}

// Given an object containing a dictionary of tile coords and numbers,
//  reveal the respective tiles on the board
//  and make them display the correct number
const updateBoard = (board) => {
  const boardTiles = Object.keys(board);
  for (let i = 0; i < boardTiles.length; i++) {
    const num = board[boardTiles[i]];
    const pos = boardTiles[i].split(',');
    revealTile(pos[0], pos[1], num);
  }
}

// Callback function for when a tile is clicked on
const clickTile = (element) => {
  const tile = element.currentTarget;
  
  const x = tile.getAttribute("data-x");
  const y = tile.getAttribute("data-y");

  if (element.ctrlKey) {
    // If the user is holding Ctrl, flag the tile
  } else {
    // Otherwise, reveal the tile
    postRevealTile(x, y);
  }
  return;
}

// Creates the board in HTML
const createBoard = () => {
  const board = document.querySelector('#board');

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
  content = document.querySelector("#content");

  boardWidth = 8;
  boardHeight = 8;

  createBoard();
  getBoard();

  // Taken from a Medium article, disables right click context menu on the board
  document.querySelector('#board').addEventListener('contextmenu', event => {
    event.preventDefault();
  });
};

window.onload = init;
