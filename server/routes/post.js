const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const authCheck = require("../middleware/authCheck");
const upload = require("../middleware/upload");

const router = express.Router();

// ================= CREATE POST =================
router.post(
  "/create",
  authCheck,
  upload.single("image"),
  async (req, res) => {
    try {
      const newPost = new Post({
        image: req.file.filename,
        caption: req.body.caption,
        user: req.userId,
        likes: [],
      });

      await newPost.save();
      res.json(newPost);
    } catch (err) {
      res.status(500).json({ message: "Post create failed" });
    }
  }
);

// ================= FEED =================
router.get("/feed", authCheck, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const posts = await Post.find({
      user: { $in: user.following.concat(req.userId) },
    })
      .sort({ createdAt: -1 })
      .populate("user", "username");

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Feed error" });
  }
});

// ================= LIKE / UNLIKE =================
router.post("/like/:id", authCheck, async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  if (post.likes.includes(req.userId)) {
    post.likes.pull(req.userId);
  } else {
    post.likes.push(req.userId);
  }

  await post.save();
  res.json(post);
});

// ================= DELETE POST =================
router.delete("/delete/:id", authCheck, async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // only owner can delete
  if (post.user.toString() !== req.userId) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post deleted successfully" });
});

// ✅ VERY IMPORTANT
module.exports = router;
