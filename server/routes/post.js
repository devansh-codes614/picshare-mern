const express = require('express');
const Post = require('../models/Post');
const authCheck = require('../middleware/authCheck');
const router = express.Router();        

// CREATE A NEW POST
router.post('/create', authCheck, async function (req, res) {
    const{imageUrl,caption} = req.body;
     
    if(!imageUrl){
        return res.status(400).send({message:'Image URL is required'});
    }

    const newPost = new Post({
        imageUrl: imageUrl,
        caption: caption,
        user: req.userId,
    });

    await newPost.save();
    res.send({message:'Post created successfully', post:newPost});
});

// LIKE A POST//UNLIKE A POST
router.post('/like/:id', authCheck, async function (req, res) {
    const postId = req.params.id;
    const userId = req.userId;
    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).send({ message: 'Post not found' });
    }

    //already liked-unlike
    if (post.likes.includes(userId)) {
        post.likes = post.likes.filter(id => id.toString() !== userId);
        await post.save();
        return  res.send({ message: 'Post unliked successfully' });
    }
    //not liked-like
    post.likes.push(userId);
    await post.save();
    res.send({ message: 'Post liked successfully' });
});

// ADD COMMENT TO A POST
router.post('/comment/:id', authCheck, async function (req, res) {
    const postId = req.params.id;
    const userId = req.userId;
    const { text } = req.body;
    if (!text) {
        return res.status(400).send({ message: 'Comment text is required' });
    }   
    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).send({ message: 'Post not found' });
    } 
    const newComment = {
        user: userId,
        text: text
    };
    post.comments.push(newComment);
    await post.save();
    res.send({ message: 'Comment added successfully' });
});

//GET FEED POSTS
router.get('/feed', authCheck, async function (req, res) {
    const userId = req.userId;
    
    const currentUser = await require('../models/User').findById(userId);
    if (!currentUser) {
        return res.status(404).send({ message: 'User not found' });
    }
    const feedPosts = await Post.find({
        user: { $in: currentUser.following }
    })
    .sort({ createdAt: -1 })
    .populate('user', 'username')
    .populate('comments.user', 'username');

    res.send( feedPosts );
});

//GET FEED POSTS

router.get('/feed', authCheck, async function (req, res) {
    const userId = req.userId;

    const User = require('../models/User');
    const currentUser = await User.findById(userId);   
    if (!currentUser) {
        return res.status(404).send({ message: 'User not found' });
    }
    const feedPosts = await Post.find({
        user: { $in: currentUser.following }
    })
    .sort({ createdAt: -1 })
    .populate('user', 'username')
    .populate('comments.user', 'username'); 
    res.send( feedPosts );
});

module.exports = router;