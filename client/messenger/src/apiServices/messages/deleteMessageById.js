export const deleteMessageById = async (messageId) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_HOST + `/messages/${messageId}`,
        {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, 
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete message");
      }
  
      const data = await response.json();
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  