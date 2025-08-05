import { useState, useEffect, useRef } from "react";

import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

import blogService from "./services/blogs";
import loginService from "./services/login";

import "./index.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(sortByLikes(blogs)));
  }, []);

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const sendNotificationMessage = (message, isSuccess) => {
    setNotificationMessage({
      message: message,
      isSuccess: isSuccess,
    });
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
      setUsername("");
      setPassword("");
      sendNotificationMessage("logged with successfully!", true);
    } catch (exception) {
      sendNotificationMessage("wrong username or password", false);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedNoteappUser");
    setUser(null);
    sendNotificationMessage("logged out sucessfully!", true);
  };

  const createBlog = async (blogObject) => {
    try {
      const blogCreated = await blogService.create(blogObject);

      blogFormRef.current.toggleVisibility();

      setBlogs(
        sortByLikes(
          blogs.concat({
            ...blogCreated,
            user: {
              name: user.name,
            },
          })
        )
      );

      sendNotificationMessage(
        `a new blog ${blogCreated.title} by ${blogCreated.author} added`,
        true
      );
    } catch (exception) {
      sendNotificationMessage(`${exception.response.data.error}`, false);
    }
  };

  const likeBlog = async (id) => {
    try {
      const blog = blogs.find((b) => b.id === id);
      const blogUpdated = await blogService.update(id, {
        ...blog,
        likes: blog.likes ? blog.likes + 1 : 1,
      });

      setBlogs(sortByLikes(blogs.map((b) => (b.id === id ? blogUpdated : b))));

      sendNotificationMessage(
        `like blog ${blogUpdated.title} by ${blogUpdated.author} successfully!`,
        true
      );
    } catch (exception) {
      sendNotificationMessage("error to like blog", false);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const blog = blogs.find((b) => b.id === id);

      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        await blogService.deleteById(id);

        setBlogs(blogs.filter((b) => b.id !== id));

        sendNotificationMessage(
          `blog ${blog.title} by ${blog.author} deleted successfully!`,
          true
        );
      }
    } catch (exception) {
      sendNotificationMessage(
        `You don't have permission to remove this blog!`,
        false
      );
    }
  };

  const sortByLikes = (blogs) => [...blogs].sort((a, b) => b.likes - a.likes);

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>

        <form onSubmit={handleSubmit}>
          <div>
            username
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              name="username"
              required={true}
              type="text"
            />
          </div>

          <div>
            password
            <input
              name="password"
              type="password"
              value={password}
              required={true}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>

          <button type="submit">login</button>
        </form>

        <Notification data={notificationMessage} />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in{" "}
        <button type="button" onClick={handleLogout}>
          logout
        </button>
      </p>

      <Notification data={notificationMessage} />

      <div>
        {/*  Blog Form*/}
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={createBlog} />
        </Togglable>
      </div>

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={likeBlog}
          deleteBlog={deleteBlog}
        />
      ))}
    </div>
  );
};

export default App;
