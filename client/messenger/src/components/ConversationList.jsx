import React, { useState, useEffect } from "react";
import { fetchConversations } from "../apiServices/conversations/fecthConversations"; // Use your function here
import { useNavigate } from "react-router-dom";

const ConversationList = ({ currentUserId }) => {
  const navigate = useNavigate();

  const [userConversations, setUserConversations] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

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

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-4">Your Conversations</h2>

      {errorMsg && <div className="text-red-500 mb-2">{errorMsg}</div>}

      {Array.isArray(userConversations) && userConversations.length > 0 ? (
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
      ) : (
        <div>No conversations yet.</div>
      )}
    </div>
  );
};

export default ConversationList;
