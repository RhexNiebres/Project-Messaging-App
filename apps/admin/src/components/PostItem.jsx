import { useState } from "react";

const PostItem = ({ post, onPostUpdated, onPostDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(post.title);
  const [updatedContent, setUpdatedContent] = useState(post.content);


  const togglePublish = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_HOST +`/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ published: !post.published }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        onPostUpdated(updatedPost); 
      } else {
        alert("Error updating post status.");
      }
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  };


  const handleUpdate = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_HOST + `/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title: updatedTitle, content: updatedContent }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        onPostUpdated(updatedPost); // update 
        setIsEditing(false); // exit editing 
      } else {
        alert("Error updating post.");
      }
    } catch (error) {
      console.error("Error updating post", error);
    }
  };

  
  const handleDelete = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_HOST + `/posts/${post.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        onPostDeleted(post.id); 
      } else {
        alert("Error deleting post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      {isEditing ? (
        <>
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          />

          <textarea
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md h-28"
          />

          <button
            onClick={handleUpdate}
            className="w-full py-3 mt-4 bg-green-500 text-white rounded-md"
          >
            Update Post
          </button>
        </>
      ) : (
        <>
          <h3 className="py-2 text-2xl font-semibold text-blue-600">{post.title}</h3>
          <p className="p-4 text-gray-700">{post.content}</p>

          <button
            onClick={togglePublish}
            className={`py-1 px-4 rounded-md text-white ${
              post.published ? "bg-gray-500" : "bg-blue-500"
            }`}
          >
            {post.published ? "Unpublish" : "Publish"}
          </button>

          <button
            onClick={() => setIsEditing(true)}
            className="py-1 px-4 bg-green-500 text-white rounded-md ml-3"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="py-1 px-4 bg-red-500 text-white rounded-md ml-3"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default PostItem;
