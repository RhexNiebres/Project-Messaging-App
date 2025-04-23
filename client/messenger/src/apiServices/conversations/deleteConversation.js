export const deleteConversation = async (id) => {
    try {
      const response = await fetch(import.meta.env.VITE_HOST + `/conversations${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, 
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete conversation");
      }
  
      const data = await response.json();
  
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  