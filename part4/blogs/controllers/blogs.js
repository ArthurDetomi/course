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

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);

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
