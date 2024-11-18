require('dotenv').config()
const express = require('express')
const connectToDatabase = require('./db/database')
const Blog = require('./model/blogModel')
const app = express()


app.use(express.json())
 connectToDatabase()

app.get("/", (req,res)=>{
    res.send("Hello World")
})

app.post("/blog",async (req,res)=>{
    const {title,description,image,subtitle} = req.body
    await Blog.create({
        title:title,
        description:description,
        image:image,
        subtitle:subtitle
    })
        res.status(200).json({
            message: "Blog created successfully"
        })
})

app.listen(process.env.PORT, ()=>{
    console.log('Server is running')
})



