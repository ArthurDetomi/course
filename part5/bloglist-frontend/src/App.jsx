import { useState, useEffect } from "react";

import Blog from "./components/Blog";
import Notification from "./components/Notification";

import blogService from "./services/blogs";
import loginService from "./services/login";

import "./index.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newBlog, setNewBlog] = useState({
    title: "",
    url: "",
    author: "",
  });
  const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
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

  const handleAddBlog = async (event) => {
    event.preventDefault();

    try {
      const blogCreated = await blogService.create(newBlog);

      setBlogs(blogs.concat(blogCreated));

      setNewBlog({
        title: "",
        author: "",
        url: "",
      });
      sendNotificationMessage(
        `a new blog ${blogCreated.title} by ${blogCreated.author} added`,
        true
      );
    } catch (exception) {
      sendNotificationMessage(`${exception.response.data.error}`, false);
    }
  };

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

      <div>
        <h2>Create new</h2>

        <Notification data={notificationMessage} />

        <form onSubmit={handleAddBlog}>
          <div>
            title
            <input
              type="text"
              value={newBlog.title}
              onChange={({ target }) =>
                setNewBlog({
                  ...newBlog,
                  title: target.value,
                })
              }
              required={true}
            />
          </div>
          <div>
            author
            <input
              type="text"
              value={newBlog.author}
              onChange={({ target }) =>
                setNewBlog({
                  ...newBlog,
                  author: target.value,
                })
              }
              required={true}
            />
          </div>
          <div>
            url
            <input
              type="text"
              value={newBlog.url}
              onChange={({ target }) =>
                setNewBlog({
                  ...newBlog,
                  url: target.value,
                })
              }
              required={true}
            />
          </div>

          <button type="submit">create</button>
        </form>
      </div>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
