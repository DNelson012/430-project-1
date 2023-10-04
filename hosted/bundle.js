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

eval("let content;\nlet nameForm;\nlet userForm;\n\n// Parse the response and display its body\nconst handleResponse = async (response, doParse) => {\n  switch (response.status) {\n    case 200:\n      content.innerHTML = '<b>Success</b>';\n      break;\n    case 201:\n      content.innerHTML = '<b>Created</b>';\n      break;\n    case 204:\n      content.innerHTML = '<b>Updated (No Content)</b>';\n      return;\n    case 400:\n      content.innerHTML = '<b>Bad Request</b>';\n      break;\n    case 404:\n      content.innerHTML = '<b>Not Found</b>';\n      break;\n    default:\n      content.innerHTML = 'Error code not implemented by client.';\n      break;\n  }\n\n  // If we called this method with the second parameter set to true,\n  // there is a body of the response to parse\n  if (doParse) {\n    const obj = await response.json();\n\n    let jsonStr;\n    if (obj.users) {\n      jsonStr = JSON.stringify(obj.users);\n    } else {\n      jsonStr = `Message: ${obj.message}`;\n    }\n    content.innerHTML += `<p>${jsonStr}</p>`;\n  }\n};\n\nconst postUser = async (form) => {\n  const nameAction = nameForm.getAttribute('action');\n  const nameMethod = nameForm.getAttribute('method');\n\n  const name = form.querySelector('#nameField').value;\n  const age = form.querySelector('#ageField').value;\n\n  // Build a data string in the FORM-URLENCODED format.\n  const formData = `name=${name}&age=${age}`;\n\n  const response = await fetch(nameAction, {\n    method: nameMethod,\n    headers: {\n      'Content-Type': 'application/x-www-form-urlencoded',\n      Accept: 'application/json',\n    },\n    body: formData,\n  });\n\n  handleResponse(response, nameMethod === 'post');\n};\n\n// When the buttn is clicked, fetch data from the server\nconst requestUpdate = async (form) => {\n  const url = form.querySelector('#urlField').value;\n  const method = form.querySelector('#methodSelect').value;\n\n  const response = await fetch(url, {\n    method,\n    headers: {\n      Accept: 'application/json',\n    },\n  });\n\n  handleResponse(response, method === 'get');\n};\n\n// Initialization\nconst init = () => {\n  // Gets the content section\n  content = document.querySelector('#content');\n\n  // Get the forms\n  nameForm = document.querySelector('#nameForm');\n  userForm = document.querySelector('#userForm');\n\n  // Handles the request to add a user\n  const addUser = (e) => {\n    e.preventDefault();\n    postUser(nameForm);\n    return false;\n  };\n\n  // Handles the request to get users\n  const getUsers = (e) => {\n    e.preventDefault();\n    requestUpdate(userForm);\n    return false;\n  };\n\n  nameForm.addEventListener('submit', addUser);\n  userForm.addEventListener('submit', getUsers);\n};\n\nwindow.onload = init;\n\n\n//# sourceURL=webpack://430-project-1/./client/client.js?");

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