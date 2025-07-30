const supertest = require("supertest");
const mongoose = require("mongoose");

const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promisseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promisseArray);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
}, 100000);

test("blogs have id property with 'id'", async () => {
  const response = await api.get("/api/blogs");

  const blogs = response.body;

  expect(blogs[0].id).toBeDefined();
}, 100000);

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "Arthur D",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((b) => b.title);
  expect(titles).toContain("async/await simplifies making async calls");
});

test("The likes property must be set to 0 if not sent", async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "Arthur D",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
  };

  const blogSaved = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  expect(blogSaved.body.likes).toBeDefined();
});

afterAll(async () => {
  await mongoose.connection.close();
});
