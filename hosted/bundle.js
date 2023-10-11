/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/client.js":
/*!**************************!*\
  !*** ./client/client.js ***!
  \**************************/
/***/ (() => {

eval("// Constants\r\nlet boardWidth;\r\nlet boardHeight;\r\n\r\n// Globals\r\nlet content;\r\n\r\n// Parse the response and display its body\r\n//  and do anything else that is needed to update the board\r\nconst handleResponse = async (response, method) => {\r\n  // Display the status code\r\n  switch (response.status) {\r\n    case 200:\r\n      content.innerHTML = '<b>Success</b>';\r\n      break;\r\n    case 201:\r\n      content.innerHTML = '<b>Created</b>';\r\n      break;\r\n    case 204:\r\n      content.innerHTML = '<b>Updated (No Content)</b>';\r\n      break;\r\n    case 400:\r\n      content.innerHTML = '<b>Bad Request</b>';\r\n      break;\r\n    case 404:\r\n      content.innerHTML = '<b>Not Found</b>';\r\n      break;\r\n    default:\r\n      content.innerHTML = 'Error code not implemented by client.';\r\n      break;\r\n  }\r\n\r\n  // If the response was from a GET,\r\n  //  display the message\r\n  if (method === \"GET\") {\r\n    const json = await response.json();\r\n\r\n    let jsonStr = \"\";\r\n    if (json.message) {\r\n      jsonStr = `Message: ${json.message}`;\r\n    }\r\n    content.innerHTML += `<p>${jsonStr}</p>`;\r\n\r\n    updateBoard(json.board);\r\n  }\r\n\r\n  // If a POST request was made to the server,\r\n  //  make a request to get the state of the board\r\n  if (method === \"POST\") {\r\n    getBoard();\r\n  }\r\n\r\n};\r\n\r\n// Send the tile to reveal in a POST request\r\nconst postRevealTile = async (x, y) => {\r\n  // Build a data string in the FORM-URLENCODED format.\r\n  const data = `xPos=${x}&yPos=${y}`;\r\n\r\n  const response = await fetch('/revealTile', {\r\n    method: 'POST',\r\n    headers: {\r\n      'Content-Type': 'application/x-www-form-urlencoded',\r\n      Accept: 'application/json',\r\n    },\r\n    body: data,\r\n  });\r\n\r\n  handleResponse(response, 'POST');\r\n};\r\n\r\n// Get the current board state from the server\r\nconst getBoard = async () => {\r\n  const response = await fetch('/getBoard', {\r\n    method: 'GET',\r\n    headers: {\r\n      Accept: 'application/json',\r\n    },\r\n  });\r\n\r\n  handleResponse(response, 'GET');\r\n};\r\n\r\n// Given a tile's x and y position and a number,\r\n//  reveal the tile at the position \r\n//  and replace its text with the given number\r\nconst revealTile = (x, y, num) => {\r\n  const tile = board.childNodes[Number(x) + boardWidth * Number(y)];\r\n\r\n  tile.classList.remove(\"hidden\");\r\n  tile.classList.add(\"revealed\");\r\n  tile.removeEventListener(\"click\", clickTile);\r\n\r\n  const inner = tile.childNodes[0];\r\n  inner.textContent = num;\r\n\r\n  if (num > 9) {\r\n    tile.classList.add(\"mine\");\r\n  }\r\n}\r\n\r\n// Given an object containing a dictionary of tile coords and numbers,\r\n//  reveal the respective tiles on the board\r\n//  and make them display the correct number\r\nconst updateBoard = (board) => {\r\n  const boardTiles = Object.keys(board);\r\n  for (let i = 0; i < boardTiles.length; i++) {\r\n    const num = board[boardTiles[i]];\r\n    const pos = boardTiles[i].split(',');\r\n    revealTile(pos[0], pos[1], num);\r\n  }\r\n}\r\n\r\n// Callback function for when a tile is clicked on\r\nconst clickTile = (element) => {\r\n  const tile = element.currentTarget;\r\n  \r\n  const x = tile.getAttribute(\"data-x\");\r\n  const y = tile.getAttribute(\"data-y\");\r\n\r\n  if (element.ctrlKey) {\r\n    // If the user is holding Ctrl, flag the tile\r\n  } else {\r\n    // Otherwise, reveal the tile\r\n    postRevealTile(x, y);\r\n  }\r\n  return;\r\n}\r\n\r\n// Creates the board in HTML\r\nconst createBoard = () => {\r\n  const board = document.querySelector('#board');\r\n\r\n  for (let i = 0; i < boardWidth; i++) {\r\n    for (let j = 0; j < boardHeight; j++) {\r\n      let element = document.createElement(\"div\");\r\n      element.classList.add(\"tile\");\r\n      element.classList.add(\"hidden\");\r\n\r\n      element.setAttribute(\"data-x\", j);\r\n      element.setAttribute(\"data-y\", i);\r\n\r\n      element.addEventListener(\"click\", clickTile);\r\n\r\n      let innerElem = document.createElement(\"div\");\r\n      innerElem.classList.add(\"tileContent\");\r\n      innerElem.textContent = `${j}${i}`;\r\n\r\n      element.appendChild(innerElem);\r\n      board.appendChild(element);\r\n    }\r\n  }\r\n}\r\n\r\n// Initialization\r\nconst init = () => {\r\n  content = document.querySelector(\"#content\");\r\n\r\n  boardWidth = 8;\r\n  boardHeight = 8;\r\n\r\n  createBoard();\r\n  getBoard();\r\n\r\n  // Taken from a Medium article, disables right click context menu on the board\r\n  document.querySelector('#board').addEventListener('contextmenu', event => {\r\n    event.preventDefault();\r\n  });\r\n};\r\n\r\nwindow.onload = init;\r\n\n\n//# sourceURL=webpack://430-project-1/./client/client.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./client/client.js"]();
/******/ 	
/******/ })()
;