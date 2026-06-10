const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register a new user
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


// Task 10: Get the book list available in the shop using Promise
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((booksList) => {
      return res.status(200).send(JSON.stringify(booksList, null, 4));
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error retrieving books" });
    });
});


// Task 11: Get book details based on ISBN using Promise
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
    .then((book) => {
      return res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});


// Task 12: Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const result = await new Promise((resolve, reject) => {
      let matchingBooks = {};

      Object.keys(books).forEach((isbn) => {
        if (books[isbn].author === author) {
          matchingBooks[isbn] = books[isbn];
        }
      });

      if (Object.keys(matchingBooks).length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found by this author");
      }
    });

    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});


// Task 13: Get book details based on title using async-await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const result = await new Promise((resolve, reject) => {
      let matchingBooks = {};

      Object.keys(books).forEach((isbn) => {
        if (books[isbn].title === title) {
          matchingBooks[isbn] = books[isbn];
        }
      });

      if (Object.keys(matchingBooks).length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found with this title");
      }
    });

    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});


module.exports.general = public_users;