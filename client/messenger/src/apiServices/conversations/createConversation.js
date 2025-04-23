export const createConversation = async (chatMembers) => {
    try {
      const response = await fetch(import.meta.env.VITE_HOST + `/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatMembers }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }
  
      const data = await response.json();
  
      return { success: true, conversation: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  