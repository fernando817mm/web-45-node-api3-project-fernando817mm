const express = require("express");
const User = require("./users-model");
const Post = require("./../posts/posts-model");

const {
  validateUserId,
  validateUser,
  validatePost,
} = require("./../middleware/middleware");

const router = express.Router();

router.get("/", (req, res, next) => {
  User.get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(next);
});

router.get("/:id", validateUserId, (req, res) => {
  res.json(req.user);
});

router.post("/", validateUser, (req, res, next) => {
  User.insert(req.body)
    .then((user) => {
      res.json(user);
    })
    .catch(next);
});

router.put("/:id", validateUserId, validateUser, (req, res, next) => {
  const { id } = req.params;
  User.update(id, req.body)
    .then((user) => {
      res.json(user);
    })
    .catch(next);
});

router.delete("/:id", validateUserId, (req, res, next) => {
  const { id } = req.params;
  const deletedUser = req.user;
  User.remove(id)
    .then(() => {
      res.json(deletedUser);
    })
    .catch(next);
});

router.get("/:id/posts", validateUserId, (req, res, next) => {
  const { id } = req.params;
  User.getUserPosts(id)
    .then((posts) => {
      res.json(posts);
    })
    .catch(next);
});

router.post("/:id/posts", validateUserId, validatePost, (req, res, next) => {
  const postInfo = { ...req.body, user_id: req.params.id };
  Post.insert(postInfo)
    .then((post) => {
      res.json(post);
    })
    .catch(next);
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    custom: "An error occurred",
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
