import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import CommentItem from "../components/CommentItem";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(import.meta.env.VITE_HOST + "/posts?published=true")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, []);

  const handleAddComment = async (postId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("You must be logged in to comment.");
      return;
    }

    const response = await fetch(import.meta.env.VITE_HOST + `/comments/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: commentContent,
        postId,
        authorId: userId,
      }),
    });

    if (response.ok) {
      const newComment = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [newComment, ...post.comments] }
            : post
        )
      );
      setCommentContent("");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="p-6 space-y-10 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-blue-700">All Posts</h1>

        {loading ? (
          <p className="text-gray-600 text-lg italic">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-600 text-lg italic">
            No posts available yet.
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border p-6 rounded-lg shadow-md space-y-4"
            >
              <h2 className="text-2xl font-semibold text-blue-800">
                {post.title}
              </h2>
              <p className="text-gray-700">{post.content}</p>

              <h3 className="text-lg font-semibold text-gray-600">Comments:</h3>

              {post.comments.length > 0 ? (
                <ul className="space-y-4">
                  {post.comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      postId={post.id}
                      setPosts={setPosts}
                    />
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No comments yet.</p>
              )}

              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-300">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="w-full py-2 mt-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Add Comment
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
