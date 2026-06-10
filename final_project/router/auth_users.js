const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Check if username already exists
  let usersWithSameName = users.filter((user) => {
    return user.username === username;
  });

  if (usersWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  // Check if username and password match
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({
      message: "Error logging in"
    });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password
      },
      "access",
      {
        expiresIn: 60 * 60
      }
    );

    req.session.authorization = {
      accessToken: accessToken,
      username: username
    };

    return res.status(200).json({
      message: "User successfully logged in"
    });
  } else {
    return res.status(208).json({
      message: "Invalid Login. Check username and password"
    });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  if (!review) {
    return res.status(400).json({
      message: "Review is required"
    });
  }

  const username = req.session.authorization.username;

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review successfully posted",
    reviews: books[isbn].reviews
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  const username = req.session.authorization.username;

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];

    return res.status(200).json({
      message: "Review successfully deleted",
      reviews: books[isbn].reviews
    });
  } else {
    return res.status(404).json({
      message: "Review not found for this user"
    });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;