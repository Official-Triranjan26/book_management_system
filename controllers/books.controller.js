const { BookModel, UserModel } = require("../models");
const IssuedBook = require("../dtos/book.dts");

exports.getAllBooks = async (req, res) => {
  const books = await BookModel.find();

  if (books.length === 0) {
    return res.status(400).json({
      success: false,
      message: "no book found",
    });
  }
  res.status(200).json({
    success: true,
    data: books,
  });
};

exports.getSingleBookById = async (req, res) => {
  const { id } = req.params;
  const book = await BookModel.findById(id);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "book with the specified id does not exist",
    });
  }

  return res.status(200).json({
    success: false,
    data: book,
  });
};

exports.getSingleBookByName = async (req, res) => {
  const { name } = req.params;
  const book = await BookModel.findOne({
    name: name,
  });
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "book with the specified id does not exist",
    });
  }

  return res.status(200).json({
    success: false,
    data: book,
  });
};

exports.getAllIssuedBooks = async (req, res) => {
  const users = await UserModel.find({
    issuedBook: { $exists: true },
  }).populate("issuedBook");

  const issuedBooks = users.map((each) => new IssuedBook(each));
  if (issuedBooks.length == 0) {
    return res.status(200).json({
      success: false,
      message: "no books issued yet",
    });
  }
  return res.status(200).json({
    success: true,
    data: issuedBooks,
  });
};

exports.getAllIssuedBooks = async (req, res) => {
  const users = await UserModel.find({
    issuedBook: { $exists: true },
  }).populate("issuedBook");

  const issuedBooks = users.map((each) => new IssuedBook(each));
  if (issuedBooks.length == 0) {
    return res.status(200).json({
      success: false,
      message: "no books issued yet",
    });
  }
  return res.status(200).json({
    success: true,
    data: issuedBooks,
  });
};

exports.addNewBook = async (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({
      success: false,
      message: "No data provided",
    });
  }

  await BookModel.create(data);

  const allBooks = await BookModel.find();

  return res.status(201).json({
    success: true,
    data: allBooks,
  });
};

exports.updateBookById = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({
      success: false,
      message: "fields to be updated not provided",
    });
  }

  const book = await BookModel.findById(id);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "user to be updated not found",
    });
  }
  const updatedBooks = await BookModel.findByIdAndUpdate(
    {
      _id: id,
    },
    data,
    {
      new: true,
    }
  );

  return res.status(200).json({
    success: true,
    message: `book with id ${id} updated successfully`,
    data: updatedBooks,
  });
};

exports.getBooksWithFine = async (req, res) => {
  const usersWithIssuedBook = await UserModel.find({
    issuedBook: { $exists: true },
  });
  let booksWithFine = [];

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
  let currentDate = new Date();

  usersWithIssuedBook.forEach(async (each) => {
    const book = await BookModel.findById(each.issuedBook);
    
    // console.log(each.name);

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
      // console.log(booksWithFine);
    }
  });
  console.log(booksWithFine);
  if (booksWithFine.length === 0) {
    return res.status(400).json({
      success: false,
      message: "currently no books with fine issued ",
    });
  }
  return res.status(200).json({
    success: true,
    data: booksWithFine,
  });
};
