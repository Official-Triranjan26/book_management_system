const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    subscriptionType: { type: String, required: true },
    subscriptionDate:{type: String, required: true },
    issuedBook:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Book",
        required:false
    },
    issuedDate:{type: String, required: false },
    returnDate:{type: String, required: false},

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
