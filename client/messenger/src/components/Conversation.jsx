import { useEffect, useState } from "react";
import { fetchConversationById } from "../apiServices/conversations/fetchConversationById";
import MessageBoard from "../components/MessageBoard";

const Conversation = ({ id }) => {
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  const senderId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    const getConversation = async () => {
      const result = await fetchConversationById(id);
      if (result.success) {
        setConversation(result.conversation);
      } else {
        setErrorMsg(result.error);
      }
      setLoading(false);
    };

    getConversation();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;

  return (
    <>
      <div className="p-4">
        <div className=" bg-blue-500 text-white p-3 rounded-xl">
          <p className="text-xl text-center text-blue-50 p-2">
            <strong>Members:</strong>{" "}
            {conversation.chatMembers.map((m) => m.username).join(", ")}
          </p>
          <MessageBoard conversation={conversation} senderId={senderId} />
        </div>
      </div>
    </>
  );
};

export default Conversation;
