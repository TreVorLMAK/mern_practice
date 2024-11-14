const mongoose = require('mongoose')

async function connectToDatabase(){
  await  mongoose.connect('mongodb+srv://bimalbhandari563:bimal123@cluster0.tn0in.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    console.log("Database connected successfully")
}




module.exports = connectToDatabase