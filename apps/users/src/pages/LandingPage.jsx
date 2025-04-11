import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
const LandingPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_HOST + "/posts?published=true"
        );
        if (!response.ok) throw new Error("Failed to fetch posts");

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false); //stop loading
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="bg-gray-100 min-screen">
      <NavBar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="text-center mt-6">
          <h1 className="text-6xl font-bold text-blue-600">
            Welcome to Brain Dump
          </h1>
          <p className="text-lg text-gray-700  mt-2">
            Please Sign up or log in to continue.
          </p>
        </div>

        <div className="mt-10 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            Recent Posts
          </h2>

          {loading ? (
            <div className="text-center text-2xl font-semibold text-blue-600 ">
              Loading...
            </div> // Display loading message
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-300 bg-white p-4 rounded-lg shadow-md mb-4"
              >
                <h3 className="text-xl font-semibold text-blue-700">
                  {post.title}
                </h3>
                <p className="text-gray-700 mt-2">{post.content}</p>
                <small className="text-gray-500 block mt-2">
                  By {post.author?.username || "Admin"}
                </small>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
