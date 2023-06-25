const express = require("express");
const { books } = require("../data/books.json");
const { users } = require("../data/users.json");

const {UserModel,BookModel}=require("../models");

const { getAllBooks } = require("../controllers/books.controller");
const { getSingleBookById } = require("../controllers/books.controller");
const { getAllIssuedBooks } = require("../controllers/books.controller");
const { addNewBook } = require("../controllers/books.controller");
const { updateBookById } = require("../controllers/books.controller");
const { getBooksWithFine } = require("../controllers/books.controller");
const { getSingleBookByName } = require("../controllers/books.controller");

const router = express.Router();

/*
Route : /books
Method : GET
Description : get all the books
Access : public
Parameter : none
*/

router.get("/", getAllBooks);

/*
Route : /books/:id
Method : GET
Description : get a book by id
Access : public
Parameter : id
*/
router.get("/:id", getSingleBookById);


/*
Route : /books/getbook/:name
Method : GET
Description : get a book by id
Access : public
Parameter : name
*/
router.get("/getbook/:name",getSingleBookByName);


/*
Route : /books/issued
Method : GET
Description : get all issued book
Access : public
Parameter : none
*/

// ----------------------------------
// locic stepwise:

/*
1. import users.json
2.filter the users.json on the basis of 'issuedBook' field
3.store the filtered objects in "usersWithIssuedBooks" variable(only store those objects from the user.json that have  'issuedBook' field)
4.create a blank array "issuedBooks"
5.we will check, if 'issuedBook' of "usersWithIssuedBooks" is equal to the book.id....then store it(The object of book) on book.

6.add more some details:
	book.issuedBy: name of the user
	book.issuedDate = each.issuedDate;
   	book.returnDate = each.returnDate;
7.push it on the blank array-"issuedBooks"
8.finally we will get the books which are already issued in -"issuedBooks"
*/
// ------------------------------------------------------------
router.get("/issued/by-user", getAllIssuedBooks);

/*
Route : /books
Method : POST
Description : create a new book
Access : public
Parameter : none
*/
router.post("/", addNewBook);

/*
Route : /books/:id
Method : PUT
Description : update a user by id
Access : public
Parameter : id
*/

router.put("/:id", updateBookById);

/*
Route : /books/issued/withFine
Method : GET
Description : get all the issued books with fine
Access : public
Parameter : none
*/
router.get("/issued/withFine", getBooksWithFine);

module.exports = router;
