const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String},
    email: { type: String},
    password: { type: String},
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' } ],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' } ],

});

module.exports = mongoose.model('User', userSchema);