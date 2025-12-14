const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    caption: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
