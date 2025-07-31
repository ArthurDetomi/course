const blogsRouter = require("express").Router();

const { userExtractor } = require("../utils/middleware");

const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const { title, author, likes, url } = request.body;

  const user = request.user;

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

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  const user = request.user;

  if (blog.user.toString() !== user.id.toString()) {
    response.status(401).json({
      error: "user not authorized to perform this action",
    });
  }

  user.blogs = user.blogs.filter((b) => b.id !== blog.id);
  await user.save();

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
