import React, { useState, useEffect,  useRef } from "react";
import { sendMessage } from "../apiServices/messages/sendMessage";
import { deleteMessageById } from "../apiServices/messages/deleteMessageById";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import NewMessageForm from "./NewMessageForm";

const MessageBoard = ({ conversation, senderId }) => {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const autoScrollRef = useRef(null);

  useEffect(() => {
    setMessages(conversation.messages);
  }, [conversation]);

  useEffect(() => {
    if (autoScrollRef.current) {
      autoScrollRef.current.scrollTop = autoScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageContent.trim()) return;

    setSubmitting(true);
    const result = await sendMessage(conversation.id, messageContent, senderId);
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
      console.log(result.deletedMessage);
      console.log(messages);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === result.deletedMessage.id ? result.deletedMessage : msg
        )
      );
      console.log(messages);
      setError(null);
    } else {
      setError(result.error);
    }
  };

  if (loading) return <p className="text-gray-600">Loading messages...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-4 px-4 border rounded shadow-md bg-white h-[80vh] w-[80vw] flex flex-col justify-center ">
      <div  ref={autoScrollRef} className=" messages-container space-y-4 p-4 h-[60vh] border border-gray-300 rounded-2xl overflow-y-auto">
        {messages.length === 0 ? (
          <NewMessageForm onSendMessage={handleSendMessage} />
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message w-2/5 mx-2 bg-gray-100 p-2 rounded-3xl shadow-lg flex  ${
                message.sender?.id === senderId
                  ? "ml-auto justify-end"
                  : "mr-auto"
              }`}
            >
              {message.sender?.id === senderId && !message.isDeleted && (
                <button
                  className=" m-4 "
                  onClick={() => handleDeleteMessage(message.id)}
                >
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    className="text-gray-400 scale-125 hover:text-red-500 hover:scale-150 transition-transform duration-300 "
                  />
                </button>
              )}
              <div
                className={`w-full ${
                  message.sender?.id === senderId ? "text-right" : "text-left"
                }`}
              >
                <div className=" px-5">
                <p className="font-extrabold text-blue-500">
                  {message.sender?.username || "Unknown"}
                </p>
                <p className="text-md text-center font-medium text-black ">
                  {message.content}
                </p>
                <p className="text-s text-gray-400">
                  sent: {new Date(message.createdAt).toLocaleString()}
                </p>
                </div>
              </div>
              
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold px-9 py-3 rounded hover:bg-blue-600 disabled:opacity-50  m-4 scale-100 hover:scale-110 transition-transform duration-300"
            disabled={submitting}
          >
            {submitting ? (
              "Sending..."
            ) : (
              <FontAwesomeIcon icon={faPaperPlane} className="scale-150" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageBoard;
