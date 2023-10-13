const board = require('./boardState.js');

// Write a response and return it to the client
const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

// Only writes a head response
const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

// General 404 response
const notFound = (request, response) => {
  // If its a HEAD request, just send the header
  if (request.method === 'HEAD') {
    return respondJSONMeta(request, response, 404);
  }

  // Return the response with the JSON
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  return respondJSON(request, response, 404, responseJSON);
};

// Return a JSON object with all revealed tiles
//  As a dict with position as a key
//  and number of mines as a value
const getBoardVisible = (request, response) => {
  // Just the HEAD
  if (request.method === 'HEAD') {
    return respondJSONMeta(request, response, 200);
  }

  // Return the response with the JSON
  const dataJSON = {
    message: 'Board sent',
    board: board.getBoard(),
  };
  return respondJSON(request, response, 200, dataJSON);
};

// Given a POST request from the client,
// attempts to update the board with the tiles that would be revealed
const tileClicked = (request, response, body) => {
  // Check if the request has the proper parameters
  if (!body.xPos || !body.yPos || !board.isValid(body.xPos, body.yPos)) {
    // Return the response with the JSON
    const dataJSON = {
      message: 'Invalid parameters for clicked tile.',
      id: 'badRequest_Clicked',
    };
    return respondJSON(request, response, 400, dataJSON);
  }

  // Reveal the tiles on the board based on the tile that was clicked on
  // This function does not return anything to the client
  board.revealTiles(body.xPos, body.yPos);

  // Check if there was a game over

  const dataJSON = {
    message: 'Server received game action.',
  };

  return respondJSON(request, response, 204, dataJSON);
};

module.exports = {
  notFound,
  getBoardVisible,
  tileClicked,
};

/*
// Returns a response with the given tile's value
// Not currently used
const getTileNum = (request, response) => {
  // Get the position from the request
  let pos = null;
  if (request.headers.body) {
    pos = request.headers.body.split(',');
  }

  // If there are no values or the values are invalid,
  //  send a badRequest response
  if (!pos || board.isValid(pos[0], pos[1])) {
    // Just the HEAD
    if (request.method === 'HEAD') {
      return respondJSONMeta(request, response, 400);
    }

    // Return the response with the JSON
    const dataJSON = {
      message: 'Invalid parameters for tile number',
      id: 'badRequest_Num',
    };
    return respondJSON(request, response, 400, dataJSON);
  }

  // Just the HEAD
  if (request.method === 'HEAD') {
    return respondJSONMeta(request, response, 200);
  }

  // Return the response with the JSON
  const dataJSON = {
    message: 'Tile received',
    tileNum: board.getTile(pos[0], pos[1]),
  };
  return respondJSON(request, response, 200, dataJSON);
};
*/
