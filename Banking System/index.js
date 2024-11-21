const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const  {connection} = require("./config/db") 
require("dotenv").config();

const cors = require("cors");


const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/api", authRoutes);
app.use("/api", transactionRoutes);

const PORT = 4500;

app.listen(PORT,async ()=>{
    try{
        await connection
        console.log(`server is running at ${PORT}`);
        console.log("connected to Db");
        
        
    }
    catch(err){
        console.log(err);
        
    }
})
