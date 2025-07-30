const blogsRouter = require("express").Router();

const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const { title, author } = request.body;

  const blog = new Blog({ title, author });

  const blogSaved = await blog.save();

  response.status(201).json(blogSaved);
});

module.exports = blogsRouter;
