import { useState } from "react";

const CommentItem = ({ comment, postId, setPosts }) => {
  const token = localStorage.getItem("token");

  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(comment.content);

  const handleEditComment = async () => {

    if (!token) {
      alert("You must be logged in to edit a comment.");
      return;
    }

    const response = await fetch(import.meta.env.VITE_HOST + `/comments/${comment.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: updatedContent }),
    });

    if (response.ok) {
      const updatedComment = await response.json();

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map((c) =>
                  c.id === comment.id ? { ...c, content: updatedComment.content } : c
                ),
              }
            : post
        )
      );

      setIsEditing(false); 
    }
  };


  const handleDeleteComment = async () => {

    if (!token) {
      alert("You must be logged in to delete a comment.");
      return;
    }

    const response = await fetch(import.meta.env.VITE_HOST + `/comments/${comment.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: post.comments.filter((c) => c.id !== comment.id) }
            : post
        )
      );
    } else {
      alert("Failed to delete comment.");
    }
  };

  return (
    <li className="border border-gray-200 p-4 rounded-md shadow-sm bg-gray-50 flex flex-col">
      <div className="flex justify-between items-center">
        <strong className="text-blue-600">{comment.author?.username || "Unknown"}</strong>
        <small className="text-gray-500">{new Date(comment.createdAt).toLocaleString()}</small>
      </div>

      {isEditing ? (
        <input
          type="text"
          value={updatedContent}
          onChange={(e) => setUpdatedContent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      ) : (
        <p className="text-gray-700 mt-2">{comment.content}</p>
      )}

      <div className="flex space-x-2 mt-4">
        {isEditing ? (
          <button
            onClick={handleEditComment}
            className="py-1 px-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
          >
            Update
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="py-1 px-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
          >
            Edit
          </button>
        )}
        <button
          onClick={handleDeleteComment}
          className="py-1 px-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default CommentItem;
