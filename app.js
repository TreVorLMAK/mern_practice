require('dotenv').config()
const express = require('express')
const connectToDatabase = require('./db/database')

const Blog = require('./model/blogModel')
const { storage,multer } = require('./middleware/multerConfig')
const app = express()
const upload = multer({storage: storage})
app.use(express.json())

 connectToDatabase()

app.get("/", (req,res)=>{
    res.send("Hello World")
})

app.post("/blog",upload.single('image'),async (req,res)=>{
    const {title,description,subtitle} = req.body
    const image = req.file ? req.file.path : null;

    if (!title || !description || !image || !subtitle) {
        return res.status(400).json({ message: "Please fill all fields" });
    }
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

app.get("/blog", async(req,res)=>{
    const blogs = await Blog.find()
    res.status(200).json({
        message:"Blogs fetched successfully",
        data : blogs
    })
})

app.use(express.static('./storage'))


app.get("/blog/:id",async (req,res)=>{
    const {id} = req.params.id
    const blog = await Blog.findById(id)
    if(!blog){
        res.status(404).json({
            message:"data not found"
        })
    } else {
        res.status(200).json({
            message:"Blog fetched successfully",
            data: blog
        })
    }
})


app.delete("/blog/:id",async (req,res)=>{
    const id = req.params.id
  await Blog.findByIdAndDelete(id)
  res.status(200).json({
    message:"Blog deleted successfully"
  })

})
app.listen(process.env.PORT, ()=>{
    console.log('Server is running')
})



