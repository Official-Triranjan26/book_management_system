const express=require("express");
//  importing json data
const { users } = require("../data/users.json");

const router=express.Router();

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
        return forFine;
    }
    //-----------------------
    
  
    const data = {
      ...user,
      subscriptionExpired: subscriptionExpiration < currentDate,
      daysLeftForExpiration:
        subscriptionExpiration <= currentDate
          ? 0
          : subscriptionExpiration - currentDate,
      fine:
        returnDate < currentDate
          ? subscriptionExpiration <= currentDate
            ? 200
            : 100
          : 0,
      fine1:subscriptionExpiration<currentDate
          ?(100+calFineForReturnDate(returnDate))
          :(0+calFineForReturnDate(returnDate))
    };
  
    res.status(200).json({
      success: true,
      data,
    });
  });
  