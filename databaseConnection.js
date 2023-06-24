const mongoose=require("mongoose");

function DbConnection(){
    const DB_URL=process.env.MONGO_URI;
    // gets the mongodb database url

    mongoose.connect(DB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    });
    //connects to the database

    const db=mongoose.connection;
    //gets the connection details

    db.on("error",console.error.bind(console,"connection error"));
    db.once("open",function(){
        console.log("Db connected_._._...")
    })
}

module.exports=DbConnection;