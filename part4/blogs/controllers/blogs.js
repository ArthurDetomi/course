const blogsRouter = require("express").Router();

const Blog = require("../models/blog");
const User = require("../models/user");

const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const { title, author, likes, url } = request.body;

  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (decodedToken === null || !decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title,
    author,
    likes: likes ?? 0,
    url,
    user: user.id,
  });

  const blogSaved = await blog.save();
  user.blogs = user.blogs.concat(blogSaved._id);
  await user.save();

  response.status(201).json(blogSaved);
});

blogsRouter.delete("/:id", async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (decodedToken === null || !decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() !== decodedToken.id.toString()) {
    response.status(401).json({
      error: "user not authorized to perform this action",
    });
  }

  await blog.deleteOne();

  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, likes, url } = request.body;

  const blog = { title, author, likes, url };

  const blogUpdated = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });

  response.json(blogUpdated);
});

module.exports = blogsRouter;
