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

eval("let content;\r\nlet nameForm;\r\nlet userForm;\r\n\r\n//\r\n\r\nlet boardWidth;\r\nlet boardHeight;\r\n\r\n// Parse the response and display its body\r\nconst handleResponse = async (response, method, obj) => {\r\n  switch (response.status) {\r\n    case 200:\r\n      content.innerHTML = '<b>Success</b>';\r\n      break;\r\n    case 201:\r\n      content.innerHTML = '<b>Created</b>';\r\n      break;\r\n    case 204:\r\n      content.innerHTML = '<b>Updated (No Content)</b>';\r\n      break;\r\n    case 400:\r\n      content.innerHTML = '<b>Bad Request</b>';\r\n      break;\r\n    case 404:\r\n      content.innerHTML = '<b>Not Found</b>';\r\n      break;\r\n    default:\r\n      content.innerHTML = 'Error code not implemented by client.';\r\n      break;\r\n  }\r\n\r\n  // If we called this method with the second parameter set to true,\r\n  // there is a body of the response to parse\r\n  if (method === \"GET\") {\r\n    const json = await response.json();\r\n\r\n    let jsonStr = \"\";\r\n    if (json.users) {\r\n      jsonStr = JSON.stringify(json.users);\r\n    } else {\r\n      jsonStr = `Message: ${json.message}`;\r\n    }\r\n    content.innerHTML += `<p>${jsonStr}</p>`;\r\n\r\n    revealTile(obj.x, obj.y, json.tileNum);\r\n  }\r\n\r\n  if (method === \"POST\") {\r\n    getTile(obj.x, obj.y);\r\n  }\r\n\r\n};\r\n\r\nconst postRevealTile = async (x, y) => {\r\n  // Build a data string in the FORM-URLENCODED format.\r\n  const data = `xPos=${x}&yPos=${y}`;\r\n\r\n  const response = await fetch('/revealTile', {\r\n    method: 'POST',\r\n    headers: {\r\n      'Content-Type': 'application/x-www-form-urlencoded',\r\n      Accept: 'application/json',\r\n    },\r\n    body: data,\r\n  });\r\n\r\n  handleResponse(response, 'POST', { x, y });\r\n};\r\n\r\nconst getTile = async (x, y) => {\r\n  const response = await fetch('/getTile', {\r\n    method: 'GET',\r\n    headers: {\r\n      Accept: 'application/json',\r\n      body: `${x},${y}`,\r\n    },\r\n  });\r\n\r\n  handleResponse(response, 'GET', {x, y});\r\n};\r\n\r\n//\r\n\r\nconst revealTile = (x, y, num) => {\r\n  const tile = board.childNodes[Number(x) + boardWidth * Number(y)];\r\n\r\n  tile.classList.remove(\"hidden\");\r\n  tile.classList.add(\"revealed\");\r\n  tile.removeEventListener(\"click\", clickTile);\r\n\r\n  const inner = tile.childNodes[0];\r\n  inner.textContent = num;\r\n\r\n  if (num > 9) {\r\n    tile.classList.add(\"mine\");\r\n  }\r\n}\r\n\r\nconst clickTile = (element) => {\r\n  const tile = element.currentTarget;\r\n  \r\n  const x = tile.getAttribute(\"data-x\");\r\n  const y = tile.getAttribute(\"data-y\");\r\n\r\n  postRevealTile(x, y);\r\n  return;\r\n}\r\n\r\nconst createBoard = () => {\r\n  const board = document.querySelector('#board');\r\n\r\n  for (let i = 0; i < boardWidth; i++) {\r\n    for (let j = 0; j < boardHeight; j++) {\r\n      let element = document.createElement(\"div\");\r\n      element.classList.add(\"tile\");\r\n      element.classList.add(\"hidden\");\r\n\r\n      element.setAttribute(\"data-x\", j);\r\n      element.setAttribute(\"data-y\", i);\r\n\r\n      element.addEventListener(\"click\", clickTile);\r\n\r\n      let innerElem = document.createElement(\"div\");\r\n      innerElem.classList.add(\"tileContent\");\r\n      innerElem.textContent = `${j}${i}`;\r\n\r\n      element.appendChild(innerElem);\r\n      board.appendChild(element);\r\n    }\r\n  }\r\n}\r\n\r\n// Initialization\r\nconst init = () => {\r\n  content = document.querySelector(\"#content\");\r\n\r\n  boardWidth = 8;\r\n  boardHeight = 8;\r\n\r\n  createBoard();\r\n};\r\n\r\nwindow.onload = init;\r\n\n\n//# sourceURL=webpack://430-project-1/./client/client.js?");

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