const express = require("express");

//importing routes
const usersRouter=require("./routes/users");
const booksRouter=require("./routes/books");

const app = express();
const port = 8081;
app.use(express.json());

app.use("/users",usersRouter);
app.use("/books",booksRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is up and running",
  });
});

app.get("*", (req, res) => {
  res.status(404).json({
    message: "This route does no exist",
  });
});

app.listen(port, () => {
  console.log(`Server running at port ${port}/`);
});
// http//localhost:8081
