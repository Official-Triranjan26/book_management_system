const express = require("express");
//  importing json data
const { users } = require("../data/users.json");

const router = express.Router();

/*
Route : /users
Method : GET
Description : get all the users
Access : public
Parameter : none
*/

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
});

/*
  Route : /users/:id
  Method : GET
  Description : get by id
  Access : public
  Parameter : id
  */

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id == id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  }
  return res.status(200).json({
    success: true,
    data: user,
  });
});

/*
  Route : /users
  Method : POST
  Description : create a n user
  Access : public
  Parameter : none
  */
router.post("/", (req, res) => {
  const { id, name, surname, email, subscriptionType, subscriptionDate } =
    req.body;

  const user = users.find((each) => each.id === id);
  if (user) {
    return res.status(404).json({
      success: false,
      message: "user exists with the same id",
    });
  }
  users.push({
    id,
    name,
    surname,
    email,
    subscriptionType,
    subscriptionDate,
  });

  return res.status(200).json({
    success: true,
    data: users,
  });
});

/*
  Route : /users/:id
  Method : PUT
  Description : update a user by id
  Access : public
  Parameter : id
  */

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  user = users.find((each) => each.id === id);
  console.log(user);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user with the id does not exist",
    });
  }
  const updatedUser = users.map((each) => {
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
    message: `user with id ${id} is updated`,
    data: updatedUser,
  });
});

/*
  Route : /users/:id
  Method : DELETE
  Description : delete a user by id
  Access : public
  Parameter : id
  */

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user to be deleted not found !",
    });
  }

  const index = users.indexOf(user);
  users.splice(index, 1);

  return res.status(200).json({
    success: true,
    message: `user with id ${id} deleted successfully`,
    data: users,
  });
});
//    default export
module.exports = router;
