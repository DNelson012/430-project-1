const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// All the URL handlers
const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/client.js': htmlHandler.getScript,

    '/getUsers': jsonHandler.getUsers,
    '/notReal': jsonHandler.notFound,
    notFound: jsonHandler.notFound,
  },
};

// Needed for POST requests, takes all the chunks of data to be sent
//  and makes sure they are compiled correctly before handling the request
// Largely unmodified from the parse-body demo
const parseRequestBody = (request, response) => {
  const body = [];

  // If there's any kind of error, set the status to 400 and end the response
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // Piece the data together
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // When all the data has been sent, concatenate the body of the request
  //  Because the body is an encoded url, we can use query.parse to turn it into an object
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    // With the body received in full, we can call the handler function
    jsonHandler.addUser(request, response, bodyParams);
  });
};

// Handle requests
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  // const acceptedTypes = request.headers.accept.split(',');

  // If receiving a post request (with a valid url), call the associated method
  //  Since /addUser is the only url that will be set up, it just checks for that url
  if (request.method === 'POST' && parsedUrl.pathname === '/addUser') {
    return parseRequestBody(request, response);
  }

  // Otherwise, assume its a GET/HEAD request
  if (urlStruct.GET[parsedUrl.pathname]) {
    return urlStruct.GET[parsedUrl.pathname](request, response, params);
  }

  // If it isn't any of those methods, return nothing found (JSON)
  return urlStruct.GET.notFound(request, response);
};

// Start server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
