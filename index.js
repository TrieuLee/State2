const express = require('express');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

// set up  express sever

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:3000","http://localhost:3001"],
    credentials:true,
})
);

app.listen(5000, () =>console.log("Server is starting at port 5000"));

app.get("/test",(req,res) => {
    res.send("Some data");
});

// set up router

app.use("/staff",require("./routers/staffRouter"));
app.use("/room",require("./routers/roomRouter"));
app.use("/customer",require("./routers/customerRouter")); 
app.use("/bookRoom",require("./routers/bookRoomRouter")); 
app.use("/service",require("./routers/serviceRouter")); 
app.use("/bookService",require("./routers/bookServiceRouter")); 

// connect to mongoDB 

mongoose.connect(process.env.MDB_CONNECT_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true
},(err)=>{
    if(err)return console.error(err);
    console.log("Connected to MongoDB")
});