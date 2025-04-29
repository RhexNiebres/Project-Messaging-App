import React, { useState, useEffect } from "react";
import { fetchConversations } from "../apiServices/conversations/fetchConversations";

const ConversationList = ({ currentUserId, setExistingConversation }) => {
  const [userConversations, setUserConversations] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadConversations = async () => {
      if (!currentUserId) return;

      try {
        const result = await fetchConversations(currentUserId);

        if (result.success) {
          setUserConversations(result.conversations);
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
    <div className="p-4 max-w-80 h-2/3 mx-5 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-4 text-center text-white bg-blue-500 p-2 rounded-2xl">
        Select Conversation
      </h2>

      {errorMsg && <div className="text-red-500 mb-2">{errorMsg}</div>}

      {Array.isArray(userConversations) && userConversations.length > 0 ? (
        <ul>
          {userConversations.map((convo) => (
            <li
              key={convo.id}
              className="border p-2 rounded mb-4 cursor-pointer hover:bg-gray-100"
              onClick={() => setExistingConversation(convo)}
            >
              <p className="font-medium text-blue-500">
                Members: {convo.chatMembers.map((m) => m.username).join(", ")}
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
