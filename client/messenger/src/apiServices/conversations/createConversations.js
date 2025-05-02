export const createConversation = async (recipientId, message, senderId) => {
    try {
      const response = await fetch(import.meta.env.VITE_HOST + `/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ recipientId, message, senderId }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }
  
      const data = await response.json();
  
      return { success: true, conversation: data.conversation };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  