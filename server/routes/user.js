const express = require('express');
const User = require('../models/User');
const authCheck = require('../middleware/authCheck');
const router = express.Router();

// FOLLOW USER
router.post('/follow/:id', authCheck, async function (req, res) {
    const targetUserId = req.params.id;
    const currentUserId = req.userId;

    if (targetUserId === currentUserId) {
        return res.status(400).send({ message: 'You cannot follow yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if(!targetUser || !currentUser) {
        return res.status(404).send({ message: 'User not found' });
    }

    if (!currentUser.following.includes(targetUserId)) {    
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
        await currentUser.save();
        await targetUser.save();
    }
    res.send({ message: 'Followed successfully' });
});

// UNFOLLOW USER

router.post('/unfollow/:id', authCheck, async function (req, res) {
    const targetUserId = req.params.id;
    const currentUserId = req.userId;   

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if(!targetUser || !currentUser) {
        return res.status(404).send({ message: 'User not found' });
    }

    currentUser.following = currentUser.following.filter( 
        id => id.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter( 
        id => id.toString() !== currentUserId
    );

    await currentUser.save();
    await targetUser.save();

    res.send({ message: 'Unfollowed successfully' });
});
module.exports = router;