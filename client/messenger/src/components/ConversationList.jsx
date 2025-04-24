import React, { useState, useEffect } from "react";
import { fetchUsers } from "../apiServices/users/fetchUsers";
import { createConversation } from "../apiServices/conversations/createConversations";
import { fetchConversations } from "../apiServices/conversations/fecthConversations"; // Use your function here
import { fetchConversationById } from "../apiServices/conversations/fetchConversationById";
import { useNavigate } from "react-router-dom";

const ConversationList = () => {
  const currentUserId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userConversations, setUserConversations] = useState([]); // Initialize as an empty array
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch all users and filter out current user
  useEffect(() => {
    const getUsers = async () => {
      const result = await fetchUsers();
      if (result.success) {
        const filtered = result.user.filter(
          (user) => user.id !== currentUserId
        );
        setUsers(filtered);
        setFilteredUsers(filtered);
      } else {
        setErrorMsg(result.error);
      }
    };

    getUsers();
  }, [currentUserId]);

  // Fetch user's conversations
  useEffect(() => {
    const loadConversations = async () => {
      if (!currentUserId) return;

      try {
        const result = await fetchConversations(currentUserId); // Using your fetchConversations function

        if (result.success) {
          setUserConversations(result.conversations); // Update the state with fetched conversations
        } else {
          setErrorMsg(result.error);
        }
      } catch (err) {
        setErrorMsg("Failed to load conversations");
      }
    };

    loadConversations();
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

  const handleStartConversation = async () => {
    if (!selectedUserId || !currentUserId) {
      setErrorMsg("Both users need to be selected");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // Creating the conversation between the selected user and the current user
      const createRes = await createConversation([parseInt(currentUserId), parseInt(selectedUserId)]);

      if (!createRes.success) throw new Error(createRes.error);

      const conversationId = createRes.conversation.id;

      const fetchRes = await fetchConversationById(conversationId);
      if (!fetchRes.success) throw new Error(fetchRes.error);

      setConversation(fetchRes.conversation);

      // Navigate to the new conversation
      navigate(`/conversation/${conversationId}`);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md">
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

      {Array.isArray(userConversations) && userConversations.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">Your Conversations</h3>
          <ul>
            {userConversations.map((conv) => (
              <li
                key={conv.id}
                className="border p-2 rounded mb-2 cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/conversation/${conv.id}`)}
              >
                <p className="font-medium">
                  Members: {conv.chatMembers.map((m) => m.username).join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ConversationList;
