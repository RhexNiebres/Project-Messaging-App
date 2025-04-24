import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchConversationById } from '../apiServices/conversations/fetchConversationById';
import NavBar from '../components/NavBar';
const ConversationPage = () => {
  const { id } = useParams();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

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
    <NavBar/>
    <div className="p-4">
      <h1 className="text-xl font-bold">Conversation #{conversation.id}</h1>
      <p><strong>Members:</strong> {conversation.chatMembers.map(m => m.username).join(', ')}</p>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Messages</h2>
        {conversation.messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <ul>
            {conversation.messages.map(msg => (
              <li key={msg.id}>
                <p><strong>{msg.senderUsername}</strong>: {msg.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </>
  );
};

export default ConversationPage;
