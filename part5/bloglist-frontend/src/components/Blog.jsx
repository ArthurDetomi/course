import { useState } from "react";

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleClick = () => {
    setVisible(!visible);
    console.log(blog);
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}{" "}
      <button onClick={handleClick}>{visible ? "hide" : "view"}</button>
      {visible && (
        <>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes ?? 0} <button>like</button>
          </p>
          <p>{blog.user.name}</p>
        </>
      )}
    </div>
  );
};

export default Blog;
