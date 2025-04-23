import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { fetchUsersById } from "../apiServices/users/fetchUserById";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    if (!userId) {
      setError("User not found in localStorage.");
      return;
    }

    fetchUsersById(userId).then((result) => {
      if (result.success) {
        setUserData(result.user);
      } else {
        setError(result.error);
      }
    });
  }, []);

  const getAvatar = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "./images/male.jpg";
      case "female":
        return "./images/female.jpg";
      default:
        return "./images/non_specified.jpg";
    }
  };

  return (
    <div>
      <NavBar />
      {error && <p className="text-red-500">{error}</p>}
      {userData ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <img
            src={getAvatar(userData.gender)}
            alt="User Avatar"
            className="w-32 h-32 rounded-full shadow-md mb-4"
          />
          <h1 className="text-xl font-bold">{userData.username}'s Profile</h1>
          <p>username {userData.username} </p>
          <p>Email: {userData.email}</p>
          <p>Gender: {userData.gender}</p>
        </div>
      ) : (
        <p className="text-center mt-8">Loading user data...</p>
      )}
    </div>
  );
};

export default UserProfile;
