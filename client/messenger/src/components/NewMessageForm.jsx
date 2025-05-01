import { useState } from "react";
import { createConversation } from "../apiServices/conversations/createConversations"; // import the API call function

const NewMessageForm = ({
  currentUserId,
  recipientId,
  onConversationCreated,
}) => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message) {
      setStatus("Message is required.");
      return;
    }

    const result = await createConversation(
      recipientId,
      message,
      currentUserId
    );

    if (result.success) {
      setStatus("Message sent successfully!");
      setMessage("");
      if (onConversationCreated) { 
        onConversationCreated(result.conversation);
      }
    } else {
      setStatus(`Error: ${result.error}`);
    }
  };

  return (
    <div className="w-full h-full mx-2 bg-gray-100 p-2 rounded shadow-lg flex justify-center items-center flex-col">
      <div className="p-4 bg-blue-500 text-gray-100 rounded-xl">
        you don't have a conversation with this person send a message now!
      </div>
      <form onSubmit={handleSendMessage} className="w-full max-w-lg space-y-4">
        <div>
          <label
            htmlFor="message"
            className="block font-semibold text-gray-700"
          >
            Message
          </label>
          <input
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md"
            placeholder="Enter your message"
          />
        </div>

        {status && <p className="text-center text-gray-700">{status}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default NewMessageForm;
