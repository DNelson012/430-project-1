let content;
let nameForm;
let userForm;

//

let boardWidth;
let boardHeight;

// Parse the response and display its body
const handleResponse = async (response, method, obj) => {
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

  // If we called this method with the second parameter set to true,
  // there is a body of the response to parse
  if (method === "GET") {
    const json = await response.json();

    let jsonStr = "";
    if (json.users) {
      jsonStr = JSON.stringify(json.users);
    } else {
      jsonStr = `Message: ${json.message}`;
    }
    content.innerHTML += `<p>${jsonStr}</p>`;

    revealTile(obj.x, obj.y, json.tileNum);
  }

  if (method === "POST") {
    getTile(obj.x, obj.y);
  }

};

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

  handleResponse(response, 'POST', { x, y });
};

const getTile = async (x, y) => {
  const response = await fetch('/getTile', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      body: `${x},${y}`,
    },
  });

  handleResponse(response, 'GET', {x, y});
};

//

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

const clickTile = (element) => {
  const tile = element.currentTarget;
  
  const x = tile.getAttribute("data-x");
  const y = tile.getAttribute("data-y");

  postRevealTile(x, y);
  return;
}

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
};

window.onload = init;
