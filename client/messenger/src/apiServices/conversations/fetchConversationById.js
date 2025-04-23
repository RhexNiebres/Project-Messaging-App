export const fetchConversationById = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_HOST}/conversations/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, 
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch conversation");
      }
  
      const data = await response.json();
  
      if (data) {
        return { success: true, conversation: data };
      } else {
        throw new Error("Conversation not found");
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
   