require('dotenv').config()
const express = require('express')
const connectToDatabase = require('./db/database')
const app = express()


app.use(express.json())
 connectToDatabase()

app.get("/", (req,res)=>{
    res.send("Hello World")
})

app.post("/blog", (req,res)=>{
        res.status(200).json({
            message: "Blog created successfully"
        })
})

app.listen(process.env.PORT, ()=>{
    console.log('Server is running')
})



