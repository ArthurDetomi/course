import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: "",
    url: "",
    author: "",
  });

  const handleAddBlog = async (event) => {
    event.preventDefault();

    await createBlog(newBlog);
    setNewBlog({
      title: "",
      url: "",
      author: "",
    });
  };

  return (
    <div>
      <h2>Create new</h2>

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
  );
};

export default BlogForm;
