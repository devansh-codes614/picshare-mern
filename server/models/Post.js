const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    image: String,
    caption: String,
    likes: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
