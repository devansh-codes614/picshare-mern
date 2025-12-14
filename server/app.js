const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/user');
const PostRoutes = require('./routes/post');

// Middleware
app.use(cors());
app.use(express.json());
app.use("/auth",require("./routes/auth"));

app.use('/user', userRoutes);
app.use('/post', PostRoutes);
app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb+srv://picshareUser:picshareUser1234@cluster0.j9orscg.mongodb.net/picshare_db?retryWrites=true&w=majority") 
.then(function()  {
    console.log("database connection done");
}).catch(function(err) {
    console.error("database connection error:", err);
});

app.get('/', function  (req, res)  {
    res.send('Welcome to PicShare ');

});

app.listen(5000,function(){
    console.log('app is running on port 5000');
});
