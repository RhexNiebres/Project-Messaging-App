import React, { useState, useEffect } from "react";
import { fetchUsers } from "../apiServices/users/fetchUsers";

const UserList = ({ currentUserId, verifyExistingConversation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  useEffect(() => {
    const getUsers = async () => {
      const result = await fetchUsers();
      if (result.success) {
        const filtered = result.user.filter(
          (user) => user.id !== parseInt(currentUserId)
        );
        setUsers(filtered);
        setFilteredUsers(filtered);
      } else {
        setErrorMsg(result.error);
      }
    };

    getUsers();
  }, [currentUserId]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="p-4 max-w-80  h-1/3 mx-5 bg-white shadow-md rounded-md ">
      <h2 className="text-lg font-semibold mb-4 bg-blue-500 p-4 rounded-2xl text-white text-center">
        Find user to chat
      </h2>

      {errorMsg && <div className="text-red-500 mb-2">{errorMsg}</div>}

      <input
        type="text"
        placeholder="Search friends by username or email"
        className="input input-bordered w-full mb-3 px-3 py-2 border rounded-md"
        value={searchTerm}
        onChange={handleSearch}
      />

      <ul className="mb-4 max-h-40 overflow-y-auto w-full">
        {filteredUsers.length > 0 ? ( filteredUsers.map((user) => (
          <li
            key={user.id}
            className={`cursor-pointer px-3 py-2 rounded-md  hover:bg-blue-100 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => !loading && verifyExistingConversation(user.id)}
          >
            <p className="font-medium text-blue-600">{user.username}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </li>
        ))):(
          <li className="text-gray-400 w-full px-3 py-2 rounded-md">No user exist with that username or email</li>
        )}
       
      </ul>
    </div>
  );
};

export default UserList;
