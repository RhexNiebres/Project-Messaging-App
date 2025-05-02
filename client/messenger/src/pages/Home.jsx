import React from "react";
import NavBar from "../components/NavBar";
import ConversationList from "../components/ConversationList";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { fetchConversations } from "../apiServices/conversations/fetchConversations";
import NewMessageForm from "../components/NewMessageForm";
import UserList from "../components/UserList";
import Conversation from "../components/Conversation";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const currentUserId = localStorage.getItem("userId");
  const [existingConversation, setExistingConversation] = useState(null);
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  const verifyExistingConversation = async (recipientId) => {
    if (!recipientId || !currentUserId) {
      setErrorMsg("Both users need to be selected");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSelectedRecipient(recipientId);

    try {
      const result = await fetchConversations(currentUserId, recipientId);

      if (result.success && result.conversations.length > 0) {
        setExistingConversation(result.conversations[0]);
      } else {
        setExistingConversation(null);
      }
    } catch (err) {
      setExistingConversation(null);
      setErrorMsg("Failed to fetch or create conversation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className=" h-screen  overflow-auto hide-scrollbar flex ">
        <div className="mt-10 py-5 ml-5 gap-7 bg-blue-500 flex flex-col justify-start  rounded-2xl h-[86vh] ">
          <UserList
            currentUserId={currentUserId}
            verifyExistingConversation={verifyExistingConversation}
          />

          <ConversationList
            currentUserId={currentUserId}
            setExistingConversation={setExistingConversation}
          />
        </div>
        <div className="w-screen flex justify-center items-center h-[88vh] pt-11">
          {!selectedRecipient ? (
            <p className=" flex justify-center items-center p-5 bg-blue-500 font-bold rounded-lg text-white">
              Select a user to start a conversation
            </p>
          ) : existingConversation ? (
            <Conversation id={existingConversation.id} />
          ) : (
            <NewMessageForm
              currentUserId={currentUserId}
              recipientId={selectedRecipient}
              onConversationCreated={(conversation) => {
                setExistingConversation(conversation);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
