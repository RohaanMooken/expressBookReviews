const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "Customer successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "Customer already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register customer." });
});


// Task 10
function getBookList() {
    return new Promise((resolve, reject) => {
        resolve(JSON.stringify(books, null, 4))
    });
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    getBookList()
        .then((response) => {
            return res.send(response);
        }).catch((err) => {
            return res.status(404).json({ errorMessage: "Failed to get books", error: err });
        })
});


// Task 11
function getBookDetailsByISBN(isbn) {
    return new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn])
        } else {
            reject("Book was not found.")
        }
    })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    getBookDetailsByISBN(isbn)
        .then((bookDetails) => {
            return res.send(bookDetails)
        }).catch((err) => {
            return res.status(404).json({ errorMessage: err })
        })
});


// Task 12
function getBookDetailsByAuthor(author) {
    return new Promise((resolve, reject) => {
        let filteredBooks = []

        for (let bookId in books) {
            const book = books[bookId]

            if (book.author === author) {
                filteredBooks.push({
                    "isbn": bookId,
                    "title": book.title,
                    "reviews": book.reviews
                });
            }
        }
        if (filteredBooks.length > 0) {
            resolve(filteredBooks)
        } else {
            reject("No books by the author: " + author + " were found.")
        }
    })
}

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    getBookDetailsByAuthor(author)
        .then((response) => {
            return res.send(response);
        }).catch((err) => {
            return res.status(404).json({ errorMessage: err })
        })
});


// Task 13
function getBookDetailsByTitle(title) {
    return new Promise((resolve, reject) => {
        let filteredBooks = []

        for (let bookId in books) {
            const book = books[bookId]

            if (book.title === title) {
                filteredBooks.push({
                    "isbn": bookId,
                    "author": book.author,
                    "reviews": book.reviews
                });
            }
        }
        if (filteredBooks.length > 0) {
            resolve(filteredBooks)
        } else {
            reject("No books with the title: " + title + " were found.")
        }
    })
}

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    getBookDetailsByTitle(title)
        .then((response) => {
            return res.send(response);
        }).catch((err) => {
            return res.status(404).json({ errorMessage: err })
        })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let reviews = books[isbn].reviews

    res.send(reviews)
});




module.exports.general = public_users;
