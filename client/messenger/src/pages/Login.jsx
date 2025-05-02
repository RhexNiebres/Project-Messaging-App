import { useState } from "react";
import { login } from "../services/Auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const passwordRegex = /^.{8,}$/;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(credentials.email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (!passwordRegex.test(credentials.password)) {
      setError("Please enter a valid password.");
      return;
    }
    setIsLoading(true);
    try {
      await login(credentials);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="py-15 hide-scrollbar flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-5xl font-bold text-black mb-6">Login</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form
          onSubmit={handleLogin}
          className="bg-white p-7 rounded-lg shadow-lg w-80"
        >
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
          </div>
          

          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold py-3 rounded-md transition duration-200 ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="flex justify-center border-t-2 mt-4">
            <button
              onClick={() => navigate("/signup")}
              className="bg-green-500 rounded-md p-2 font-semibold text-white mt-5 "
            >
              Create new account?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
