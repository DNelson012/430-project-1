let content;
let nameForm;
let userForm;

// Parse the response and display its body
const handleResponse = async (response, doParse) => {
  switch (response.status) {
    case 200:
      content.innerHTML = '<b>Success</b>';
      break;
    case 201:
      content.innerHTML = '<b>Created</b>';
      break;
    case 204:
      content.innerHTML = '<b>Updated (No Content)</b>';
      return;
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
  if (doParse) {
    const obj = await response.json();

    let jsonStr;
    if (obj.users) {
      jsonStr = JSON.stringify(obj.users);
    } else {
      jsonStr = `Message: ${obj.message}`;
    }
    content.innerHTML += `<p>${jsonStr}</p>`;
  }
};

const postUser = async (form) => {
  const nameAction = nameForm.getAttribute('action');
  const nameMethod = nameForm.getAttribute('method');

  const name = form.querySelector('#nameField').value;
  const age = form.querySelector('#ageField').value;

  // Build a data string in the FORM-URLENCODED format.
  const formData = `name=${name}&age=${age}`;

  const response = await fetch(nameAction, {
    method: nameMethod,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: formData,
  });

  handleResponse(response, nameMethod === 'post');
};

// When the buttn is clicked, fetch data from the server
const requestUpdate = async (form) => {
  const url = form.querySelector('#urlField').value;
  const method = form.querySelector('#methodSelect').value;

  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
    },
  });

  handleResponse(response, method === 'get');
};

// Initialization
const init = () => {
  // Gets the content section
  content = document.querySelector('#content');

  // Get the forms
  nameForm = document.querySelector('#nameForm');
  userForm = document.querySelector('#userForm');

  // Handles the request to add a user
  const addUser = (e) => {
    e.preventDefault();
    postUser(nameForm);
    return false;
  };

  // Handles the request to get users
  const getUsers = (e) => {
    e.preventDefault();
    requestUpdate(userForm);
    return false;
  };

  nameForm.addEventListener('submit', addUser);
  userForm.addEventListener('submit', getUsers);
};

window.onload = init;
