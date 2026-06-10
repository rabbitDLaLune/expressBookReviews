const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({
        username: username,
        password: password
      });

      return res.status(200).json({
        message: "User successfully registered. Now you can login"
      });
    } else {
      return res.status(404).json({
        message: "User already exists!"
      });
    }
  }

  return res.status(404).json({
    message: "Unable to register user."
  });
});


// Internal route used by Axios for Task 10
public_users.get('/internal/books', function (req, res) {
  return res.status(200).json(books);
});


// Internal route used by Axios for Task 11
public_users.get('/internal/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({
      message: "Book not found"
    });
  }
});


// Internal route used by Axios for Task 12
public_users.get('/internal/author/:author', function (req, res) {
  const author = req.params.author;
  let matchingBooks = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author === author) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({
      message: "No books found by this author"
    });
  }
});


// Internal route used by Axios for Task 13
public_users.get('/internal/title/:title', function (req, res) {
  const title = req.params.title;
  let matchingBooks = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title === title) {
      matchingBooks[isbn] = books[isbn];
    }
  });

  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({
      message: "No books found with this title"
    });
  }
});


// Task 10: Get the book list available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/internal/books');
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});


// Task 11: Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/internal/isbn/${isbn}`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(404).json({
      message: "Book not found"
    });
  }
});


// Task 12: Get book details based on Author using Promise callbacks with Axios
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  axios.get(`http://localhost:5000/internal/author/${encodeURIComponent(author)}`)
    .then((response) => {
      return res.status(200).send(JSON.stringify(response.data, null, 4));
    })
    .catch((error) => {
      return res.status(404).json({
        message: "No books found by this author"
      });
    });
});


// Task 13: Get book details based on Title using Promise callbacks with Axios
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  axios.get(`http://localhost:5000/internal/title/${encodeURIComponent(title)}`)
    .then((response) => {
      return res.status(200).send(JSON.stringify(response.data, null, 4));
    })
    .catch((error) => {
      return res.status(404).json({
        message: "No books found with this title"
      });
    });
});


// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({
      message: "Book not found"
    });
  }
});


module.exports.general = public_users;
