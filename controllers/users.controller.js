const {BookModel,UserModel}=require("../models");

const getAllUsers=async (req, res) => {
    const users=await UserModel.find();

    res.status(200).json({
        success: true,
        data: users,
    });
}

const getUserById= async (req, res) => {
    const { id } = req.params;
    const user =await UserModel.findById(id);
    if(!user){
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
}

const createNewUser= async (req, res) => {
    const {data} =req.body;
    console.log(data);
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "data not provided",
      });
    }

    await UserModel.create(data);
    const users=await UserModel.find();
  
    return res.status(200).json({
      success: true,
      data: users,
    });
}

const updateAUser=async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    if (!data) {
        return res.status(404).json({
          success: false,
          message: "data not provided",
        });
    }
    const user=await UserModel.findById(id);
    if(!user){
        return res.status(404).json({
            success: false,
            message: "user to be updated not found",
          });
    }
    const updatedUser=await UserModel.findByIdAndUpdate(
        {
            _id:id
        },
        data,
        {
            new:true
        }
    )
    return res.status(200).json({
      success: true,
      message: `user with id ${id} is updated`,
      data: updatedUser,
    });
}

const deleteUser=async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user to be deleted not found !",
      });
    }
    await UserModel.deleteOne({_id:id});
    const users=await UserModel.find();
  
    return res.status(200).json({
      success: true,
      message: `user with id ${id} deleted successfully`,
      data: users,
    });
}

const getUserSubscriptionDetails=async(req, res) => {
  const { id } = req.params;

  const user = await UserModel.findById(id); 

  console.log(user);

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
    ...user._doc,

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
    data:data
  });
}


module.exports={getAllUsers,getUserById,createNewUser,updateAUser,deleteUser,getUserSubscriptionDetails};