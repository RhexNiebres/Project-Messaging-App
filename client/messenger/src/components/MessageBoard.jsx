import React, { useState, useEffect } from "react";
import { fetchMessagesByConversationId } from "../apiServices/messages/fetchMessagesByConversationId";
import { sendMessage } from "../apiServices/messages/sendMessage";
import { deleteMessageById } from "../apiServices/messages/deleteMessageById";

const MessageBoard = ({ conversationId, senderId }) => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      const result = await fetchMessagesByConversationId(conversationId);
      if (result.success) {
        setMessages(result.messages);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };
    loadMessages();
  }, [conversationId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageContent.trim()) return;

    setSubmitting(true);
    const result = await sendMessage(conversationId, messageContent, senderId);
    if (result.success) {
      setMessages((prevMessages) => [...prevMessages, result.message]);
      setMessageContent("");
      setError(null);
    } else {
      setError(result.error);
    }
    setSubmitting(false);
  };

  const handleDeleteMessage = async (messageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (!confirmed) return;

    const result = await deleteMessageById(messageId);
    if (result.success) {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
      setError(null);
    } else {
      setError(result.error);
    }
  };

  if (loading) return <p className="text-gray-600">Loading messages...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-4 px-4 border rounded shadow-md bg-white h-[80vh] w-[80vw] flex flex-col justify-center ">
      <div className="messages-container space-y-4 p-4 h-[60vh] border border-gray-300 rounded-2xl overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500 p-10 flex justify-center items-center">
            No messages yet. Start your conversation now!
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message w-56 mx-2 bg-gray-100 p-3 rounded shadow-lg flex items-start ${
                message.sender?.id === senderId
                  ? "ml-auto justify-end"
                  : "mr-auto"
              }`}
            >
              <div
                className={`w-full max-w-[60%] ${
                  message.sender?.id === senderId ? "text-right" : "text-left"
                }`}
              >
                <p className="font-extrabold text-blue-500">
                  {message.sender?.username || "Unknown"}
                </p>
                <p className="text-md font-medium text-black">
                  {message.content}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
              {message.sender?.id === senderId && (
                <button
                  className="text-red-500 text-sm hover:underline font-extrabold ml-2"
                  onClick={() => handleDeleteMessage(message.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
      <div className="sticky bottom-0 w-full flex flex-row space-x-3 p-6 ">
        <form
          onSubmit={handleSendMessage}
          className="flex flex-row items-center w-full"
        >
          <textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type your message..."
            rows="3"
            className="flex-grow p-2 border rounded resize-none text-black"
            disabled={submitting}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold px-9 py-3 rounded hover:bg-blue-600 disabled:opacity-50  m-4"
            disabled={submitting}
          >
            {submitting ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageBoard;
