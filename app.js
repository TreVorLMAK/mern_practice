// require('dotenv').config()
// const express = require('express')
// const connectToDatabase = require('./db/database')

// const Blog = require('./model/blogModel')
// const { storage,multer } = require('./middleware/multerConfig')
// const app = express()
// const upload = multer({storage: storage})
// const fs = require('fs')
// const cors = require('cors')

// app.use(express.json())



// app.use(cors({
//     origin : "http://localhost:5173"
// }))

//  connectToDatabase()

// app.get("/", (req,res)=>{
//     res.send("Hello World")
// })

// app.post("/blog",upload.single('image'),async (req,res)=>{
//     const {title,description,subtitle} = req.body
//     const image = req.file ? req.file.path : null;

//     if (!title || !description || !image || !subtitle) {
//         return res.status(400).json({ message: "Please fill all fields" });
//     }
//     await Blog.create({
//         title:title,
//         description:description,
//         image:image,
//         subtitle:subtitle
//     })
//         res.status(200).json({
//             message: "Blog created successfully"
//         })
// })

// app.get("/blog", async(req,res)=>{
//     const blogs = await Blog.find()
//     res.status(200).json({
//         message:"Blogs fetched successfully",
//         data : blogs
//     })
// })

// app.use(express.static('./storage'))


// app.get("/blog/:id",async (req,res)=>{
//     const {id} = req.params.id
//     const blog = await Blog.findById(id)
//     if(!blog){
//         res.status(404).json({
//             message:"data not found"
//         })
//     } else {
//         res.status(200).json({
//             message:"Blog fetched successfully",
//             data: blog
//         })
//     }
// })


// app.delete("/blog/:id",async (req,res)=>{
//     const id = req.params.id
//     const blog = await Blog.findById(id)
//     const imageName = blog.image
//     fs.unlink(`storage/${imageName}`,(err)=>{
//         if(err){
//             console.log(err)
//         } else {
//             console.log("image deleted")
//         }
//     })
//   await Blog.findByIdAndDelete(id)
//   res.status(200).json({
//     message:"Blog deleted successfully"
//   })

// app.patch('/blog/:id',upload.single('image'), async(req,res)=>{
//     const id = req.params.id
//     const {title,subtitle,description}= req.body 
//     let imageName;
//     if(req.file){
//         imageName = req.file.filename
//         const blog = await Blog.findById(id)
//         const oldiImageName = blog.image

//         fs.unlink(`storage/${imageName}`,(err)=>{
//             if(err){
//                 console.log(err)
//             } else {
//                 console.log("image deleted")
//             }
//         })
//     }
//     await Blog.findByIdAndUpdate(id,{
//         title:title,
//         subtitle:subtitle,
//         description:description,
//         image:imageName
//     })
//     res.status(200).json({
//         message:"Blog updated successfully"
//     })
// })

// })
// app.listen(process.env.PORT, ()=>{
//     console.log('Server is running')
// })


require('dotenv').config();
const express = require('express');
const connectToDatabase = require('./db/database');
const Blog = require('./model/blogModel');
const { storage, multer } = require('./middleware/multerConfig');
const fs = require('fs');
const cors = require('cors');

const app = express();
const upload = multer({ storage });
const path = require('path')

app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173" , "https://blog-frontend-alpha-brown.vercel.app"] }));
app.use('/storage', express.static('storage')); // Serve static files
connectToDatabase();

// Test route
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Create Blog
// app.post("/blog", upload.single('image'), async (req, res) => {
//     const { title, description, subtitle } = req.body;
//     const image = req.file ? req.file.path : null;
//     let filename;
//     if(req.file){
//         filename = req.file.filename
//     }else{
//         filename = "me.jpg"
//     }

//     if (!title || !description || !image || !subtitle) {
//         return res.status(400).json({ message: "Please fill all fields" });
//     }
//     try {
//         await Blog.create({ title, description, subtitle, image });
//         res.status(200).json({ message: "Blog created successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
// });

app.post("/blog", upload.single('image'), async (req, res) => {
    const { title, description, subtitle } = req.body;
    let filename;
    if(req.file){
        filename = "http://localhost:3000/" + req.file.filename
    }else{
        filename = "https://preview.redd.it/i-got-bored-so-i-decided-to-draw-a-random-image-on-the-v0-4ig97vv85vjb1.png?width=640&crop=smart&auto=webp&s=22ed6cc79cba3013b84967f32726d087e539b699"
    }

    // Validation
    if (!title || !description || !subtitle) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    try {
        // Create the blog
        await Blog.create({ 
            title : title, 
            description : description, 
            subtitle : subtitle, 
            image: filename
        });

        return res.status(200).json({ message: "Blog created successfully" });
    } catch (error) {
        console.error("Error creating blog:", error); // Log the error for debugging
        return res.status(500).json({ 
            message: "Server error occurred while creating the blog", 
            error: error.message 
        });
    }
});

// Get all blogs
app.get("/blog", async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json({ message: "Blogs fetched successfully", data: blogs });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get blog by ID
app.get("/blog/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json({ message: "Blog fetched successfully", data: blog });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Delete blog
app.delete("/blog/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Data not found" });
        }

        fs.unlink(blog.image, (err) => {
            if (err) console.error("Image deletion error:", err);
        });

        await Blog.findByIdAndDelete(id);
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Update blog
app.patch('/blog/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, subtitle, description } = req.body;
    let imageName;

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Data not found" });
        }

        if (req.file) {
            imageName = "http://localhost:3000/" + req.file.path;
            fs.unlink(blog.image, (err) => {
                if (err) console.error("Old image deletion error:", err);
            });
        }

        await Blog.findByIdAndUpdate(id, { title, subtitle, description, image: imageName || blog.image });
        res.status(200).json({ message: "Blog updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

