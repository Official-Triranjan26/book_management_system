const express = require("express");
const { books } = require("../data/books.json");
const { users } = require("../data/users.json");

const {UserModel,BookModel}=require("../models");

const { getAllBooks } = require("../controllers/books.controller");
const { getSingleBookById } = require("../controllers/books.controller");
const { getAllIssuedBooks } = require("../controllers/books.controller");

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

router.post("/", (req, res) => {
  const { id, name, author, genre, price, publisher } = req.body;

  const book = books.find((each) => each.id === id);
  if (book) {
    return res.status(400).json({
      success: false,
      message: "book with same id already exists",
    });
  }
  books.push({
    id,
    name,
    author,
    genre,
    price,
    publisher,
  });
  return res.status(200).json({
    success: true,
    message: "book added successfully",
    data: books,
  });
});

/*
Route : /books/:id
Method : PUT
Description : update a user by id
Access : public
Parameter : id
*/

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({
      success: false,
      message: "fields to be updated not provided",
    });
  }

  const book = books.find((each) => each.id === id);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "user to be updated not found",
    });
  }
  const updatedBooks = books.map((each) => {
    if (each.id === id) {
      return {
        ...each,
        ...data,
      };
    }
    return each;
  });

  return res.status(200).json({
    success: true,
    message: `book with id ${id} updated successfully`,
    data: updatedBooks,
  });
});

/*
Route : /books/issued/withFine
Method : GET
Description : get all the issued books with fine
Access : public
Parameter : none
*/
router.get("/issued/withFine", (req, res) => {
  const usersWithIssuedBook = users.filter((each) => {
    if (each.issuedBook) {
      return each;
    }
  });
  const booksWithFine = [];

  const getDateInDays = (data = "") => {
    let date;
    if (data === "") {
      // current date
      date = new Date();
    } else {
      // getting date on bacis of data variable
      date = new Date(data);
    }
    let days = Math.floor(date / (1000 * 60 * 60 * 24));
    return days;
  };

  const subscriptionType = (date, user) => {
    if (user.subscriptionType === "Basic") {
      date = date + 90;
    } else if (user.subscriptionType === "Standard") {
      date = date + 180;
    } else if (user.subscriptionType === "Premium") {
      date = date + 365;
    }
    return date;
  };
  //   let currentDate=new Date();

  usersWithIssuedBook.forEach((each) => {
    const book = books.find((book) => book.id === each.issuedBook);

    book.issuedBy_name = each.name;
    book.issuedBy_surname = each.surname;
    book.issuedDate = each.issuedDate;

    let subscriptionDateInDays = getDateInDays(each.subscriptionDate);
    let subscriptionExpiretion = subscriptionType(subscriptionDateInDays, each);

    if (
      getDateInDays() > subscriptionExpiretion ||
      getDateInDays() > getDateInDays(each.returnDate)
    ) {
      book.fineForLateReturn = getDateInDays() > getDateInDays(each.returnDate);
      book.fineForSubscriptionExpiry = getDateInDays() > subscriptionExpiretion;
      booksWithFine.push(book);
    }
  });
  if (booksWithFine.length == 0) {
    return res.status(400).json({
      success: false,
      message: "currently no books with fine issued ",
    });
  }
  return res.status(200).json({
    success: true,
    data: booksWithFine,
  });
});

module.exports = router;
