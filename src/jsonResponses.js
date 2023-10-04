// A very bad way to store info for a server
const users = {};

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

  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

// Returns the user object as JSON
const getUsers = (request, response) => {
  // If handling a HEAD request, the data isn't needed
  if (request.method === 'HEAD') {
    return respondJSONMeta(request, response, 200);
  }

  // Get the users and add them to the response
  const dataJSON = {
    users,
  };
  return respondJSON(request, response, 200, dataJSON);
};

// Adds the user in the request to the object stored in server memory
//  Based on the same method from the body-parse demo
const addUser = (request, response, body) => {
  // Initialize a default json object
  const dataJSON = {
    message: 'Name and age are both required.',
  };

  // If the parameters are not present, return a bad request
  if (!body.name || !body.age) {
    dataJSON.id = 'missingParams';
    return respondJSON(request, response, 400, dataJSON);
  }

  // Default status code: 204, Updated
  let responseCode = 204;

  // If the user doesn't exist yet
  if (!users[body.name]) {
    // Set the status code to 201 (created) and create an empty user
    responseCode = 201;
    users[body.name] = {};
  }

  // Add (or update) fields for this user name
  users[body.name].name = body.name;
  users[body.name].age = body.age;

  // If a new user was made, send back the response
  if (responseCode === 201) {
    dataJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, dataJSON);
  }

  // If there was already a user that was now updated,
  // return just the head instead
  return respondJSONMeta(request, response, responseCode);
};

module.exports = {
  getUsers,
  addUser,
  notFound,
};
