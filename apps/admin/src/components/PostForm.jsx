import { useState } from "react";

const PostForm = ({ onPostAdded }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAddPost = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_HOST + "/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, content }),
      });
      const newPost = await response.json();
      if (response.ok) {
        onPostAdded(newPost);
        setTitle("");
        setContent("");
      } else {
        alert("Error Adding Post:" + newPost.error);
      }
    } catch (error) {
      console.error("Error Adding POst:", error);
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
      <h2 className="text-2xl font-semibold text-blue-700">Add New Post</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md mt-3"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md mt-3 h-28"
      />
      <button
        onClick={handleAddPost}
        className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
      >
        Add Post
      </button>
    </div>
  );
};

export default PostForm;
