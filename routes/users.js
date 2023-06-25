const express = require("express");
//  importing json data
const { users } = require("../data/users.json");
const {getAllUsers,getUserById,createNewUser,updateAUser,deleteUser,getUserSubscriptionDetails}=require("../controllers/users.controller");
const { UserModel } = require("../models");

const router = express.Router();

/*
Route : /users
Method : GET
Description : get all the users
Access : public
Parameter : none
*/

router.get("/", getAllUsers);

/*
  Route : /users/:id
  Method : GET
  Description : get by id
  Access : public
  Parameter : id
  */

router.get("/:id", getUserById);

/*
  Route : /users
  Method : POST
  Description : create a n user
  Access : public
  Parameter : none
  */
router.post("/", createNewUser);

/*
  Route : /users/:id
  Method : PUT
  Description : update a user by id
  Access : public
  Parameter : id
  */

router.put("/:id", updateAUser);

/*
  Route : /users/:id
  Method : DELETE
  Description : delete a user by id
  Access : public
  Parameter : id
  */

router.delete("/:id", deleteUser);

 /**
 * Route: /users/subscription-details/:id
 * Method: GET
 * Description: Get all user subscription details
 * Access: Public
 * Parameters: id
 */

 router.get("/subscription-details/:id", getUserSubscriptionDetails);


//    default export
module.exports = router;
