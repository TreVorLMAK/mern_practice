require('dotenv').config()
const express = require('express')
const connectToDatabase = require('./db/database')
const app = express()

 connectToDatabase()

app.get("/", (req,res)=>{
    res.send("Hello World")
})


app.listen(process.env.PORT, ()=>{
    console.log('Server is running')
})



