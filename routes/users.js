const express=require("express");
//  importing json data
const { users } = require("../data/users.json");

const router=express.Router();

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
      message:`user with id ${id} is updated`,
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
  
  router.delete("/:id",(req,res)=>{
    const {id}=req.params;
    const user=users.find((each)=>each.id===id);
  
    if (!user){
      return res.status(404).json({
        success:false,
        message:"user to be deleted not found !"
      });
    }
  
    const index=users.indexOf(user);
    users.splice(index,1);
  
    return res.status(200).json({
      success:true,
      message:`user with id ${id} deleted successfully`,
      data:users
    });
  })


  /**
 * Route: /users/subscription-details/:id
 * Method: GET
 * Description: Get all user subscription details
 * Access: Public
 * Parameters: id
 */
router.get("/subscription-details/:id", (req, res) => {
  const { id } = req.params;

  const user = users.find((each) => each.id === id);

  if (!user)
    return res.status(404).json({
      success: false,
      message: "User not found",
    });

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

  const subscriptionType = (date) => {
    if (user.subscriptionType === "Basic") {
      date = date + 90;
    } else if (user.subscriptionType === "Standard") {
      date = date + 180;
    } else if (user.subscriptionType === "Premium") {
      date = date + 365;
    }
    return date;
  };

  // Subscription expiration calculation
  // January 1, 1970, UTC. // milliseconds
  let returnDate = getDateInDays(user.returnDate);
  let currentDate = getDateInDays();
  let subscriptionDate = getDateInDays(user.subscriptionDate);
  let subscriptionExpiration = subscriptionType(subscriptionDate);

  console.log("Return Date ", returnDate);
  console.log("Current Date ", currentDate);
  console.log("Subscription Date ", subscriptionDate);
  console.log("Subscription expiry date", subscriptionExpiration);

  //--------------------
  const calFineForReturnDate=(returnDate)=>{
    let currentDate = getDateInDays();
    let forFine;
    if(currentDate>returnDate){
        forFine=5*(currentDate-returnDate);
    }
    else{
      forFine=0;
    }
    return forFine;
}
const isSubscriptionExpared=(subscriptionExpiration)=>{
  if(currentDate>subscriptionExpiration){
    return 100;
  }
  else{
    return 0;
  }
}
//-----------------------

  const data = {
    ...user,

    subscriptionDetailsBelow:"-------------------------",

    subscriptionExpired: subscriptionExpiration < currentDate,

    daysLeftForSubscriptionExpiration:
      subscriptionExpiration <= currentDate
        ? 0
        : subscriptionExpiration - currentDate,

    subscriptionExpireFine:
      isSubscriptionExpared(subscriptionExpiration),

    lateBooksReturn_inDays:
      currentDate>returnDate
        ?currentDate-returnDate
        :0,

    lateBooksReturnFine:
      calFineForReturnDate(returnDate),
      
    totalFine:
      isSubscriptionExpared(subscriptionExpiration)+
      calFineForReturnDate(returnDate)
  };

  res.status(200).json({
    success: true,
    data,
  });
});

  //    default export
  module.exports=router;