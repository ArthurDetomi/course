const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);

  await User.deleteMany({});

  const promisseArray = helper.initialUsers.map(async (user) => {
    const passwordHash = await bcrypt.hash(user.password, 10);
    const userToSave = new User({
      username: user.username,
      passwordHash: passwordHash,
    });
    return userToSave.save();
  });

  await Promise.all(promisseArray);
});

describe("when there is initially some blogs saved", () => {
  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  }, 100000);
});

describe("addition of a new blog", () => {
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "async/await simplifies making async calls",
      author: "Arthur D",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    };

    const loginResponse = await api.post("/api/login").send({
      username: "lucia",
      password: "senha123",
    });

    const tokenJwt = loginResponse.body.token;

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${tokenJwt}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).toContain("async/await simplifies making async calls");
  }, 100000);

  test("The likes property must be set to 0 if not sent", async () => {
    const newBlog = {
      title: "async/await simplifies making async calls",
      author: "Arthur D",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    };

    const loginResponse = await api.post("/api/login").send({
      username: "lucia",
      password: "senha123",
    });

    const tokenJwt = loginResponse.body.token;

    const blogSaved = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${tokenJwt}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(blogSaved.body.likes).toBeDefined();
  }, 100000);

  test("blog without url or title is not added", async () => {
    const newBlog = {
      author: "Arthur D",
      likes: 13,
    };

    const loginResponse = await api.post("/api/login").send({
      username: "lucia",
      password: "senha123",
    });

    const tokenJwt = loginResponse.body.token;

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${tokenJwt}`)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  }, 100000);
});

test("blogs have id property with 'id'", async () => {
  const response = await api.get("/api/blogs");

  const blogs = response.body;

  expect(blogs[0].id).toBeDefined();
}, 100000);

describe("update of a blog", () => {
  test("information of blog must be updated", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdated = blogsAtStart[0];

    const blogUpdated = await api
      .put(`/api/blogs/${blogToUpdated.id}`)
      .send({ likes: 23 })
      .expect(200);

    expect(blogUpdated.body.likes).toBe(23);
    expect(blogUpdated.body.id).toBe(blogToUpdated.id);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdated.id);
    expect(updatedBlog.likes).toBe(23);
  });
});

// Users Test
describe("addition of a new user", () => {
  test("a valid user can be added", async () => {
    const newUser = {
      name: "User",
      username: "usertest",
      password: "12345678",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  }, 100000);

  test("password user must have length greater than 3", async () => {
    const newUser = {
      name: "User",
      username: "usertest",
      password: "12",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length);
  }, 100000);

  test("username must be unique", async () => {
    const newUser = {
      username: helper.initialUsers[0].username,
      name: "Lucas",
      password: "matias",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length);
  }, 100000);
});

afterAll(async () => {
  await mongoose.connection.close();
});
