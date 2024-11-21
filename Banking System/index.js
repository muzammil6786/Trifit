const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const  {connection} = require("./config/db");
const { swaggerSpec, swaggerUi } = require("./swagger/swagger");
require("dotenv").config();

const cors = require("cors");


const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
