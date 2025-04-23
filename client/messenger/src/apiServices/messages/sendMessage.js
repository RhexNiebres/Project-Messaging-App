export const sendMessage = async (conversationId, content, senderId) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_HOST + `/${conversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ content, senderId }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
  
      const data = await response.json();
      return { success: true, message: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  