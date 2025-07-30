const blogsRouter = require("express").Router();

const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const { title, author, likes, url } = request.body;

  const blog = new Blog({
    title,
    author,
    likes: likes ?? 0,
    url,
  });

  const blogSaved = await blog.save();

  response.status(201).json(blogSaved);
});

module.exports = blogsRouter;
