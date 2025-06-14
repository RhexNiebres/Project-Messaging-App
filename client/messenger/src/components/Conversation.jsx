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
    <div className=" p-3 m-2 rounded-xl max-w-full shadow-xl bg-blue-500">
      <p className="text-xl sm:text-2xl font-semibold text-left text-white break-words p-2 ">
        {conversation.chatMembers
          .filter((m) => m.id !== senderId)
          .map((m) => m.username)
          .join(", ")}
      </p>
      <MessageBoard conversation={conversation} senderId={senderId} />
    </div>
  );
};

export default Conversation;
