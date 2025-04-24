import React, { useState, useEffect } from "react";
import { fetchUsers } from "../apiServices/users/fetchUsers";
import { createConversation } from "../apiServices/conversations/createConversations";
import { fetchConversationById } from "../apiServices/conversations/fetchConversationById";
import { useNavigate } from "react-router-dom";

const AddConversation = ({ currentUserId }) => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      const result = await fetchUsers();
      if (result.success) {
        // exclude current user 
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

  //search functionality
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

  //conversation creation
  const handleStartConversation = async () => {
    if (!selectedUserId || !currentUserId) {
      setErrorMsg("Both users need to be selected");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const createRes = await createConversation([parseInt(currentUserId), parseInt(selectedUserId)]);
      if (!createRes.success) throw new Error(createRes.error);

      const conversationId = createRes.conversation.id;

      const fetchRes = await fetchConversationById(conversationId);
      if (!fetchRes.success) throw new Error(fetchRes.error);


      navigate(`/conversation/${conversationId}`);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md flex flex-col justify-start items-start">
      <h2 className="text-lg font-semibold mb-4">Start a Conversation</h2>

      {errorMsg && <div className="text-red-500 mb-2">{errorMsg}</div>}

      <input
        type="text"
        placeholder="Search by username or email"
        className="input input-bordered w-full mb-3 px-3 py-2 border rounded-md"
        value={searchTerm}
        onChange={handleSearch}
      />

      <ul className="mb-4 max-h-40 overflow-y-auto">
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            className={`cursor-pointer px-3 py-2 rounded-md ${
              selectedUserId === user.id ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
            onClick={() => setSelectedUserId(user.id)}
          >
            <p className="font-medium">{user.username}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </li>
        ))}
      </ul>

      <button
        onClick={handleStartConversation}
        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
        disabled={!selectedUserId || loading}
      >
        {loading ? "Creating..." : "Start Conversation"}
      </button>
    </div>
  );
};

export default AddConversation;
