const express = require('express')
const connectToDatabase = require('./db/database')
const app = express()

connectToDatabase()

app.get("/", (req,res)=>{
    res.send("Hello World")
})


app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
})



