export const updateUser = async (id, userData) => {
    try {
      const response = await fetch(import.meta.env.VITE_HOST + `/users/${id}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body:JSON.stringify(userData)
      });
        
      if (!response.ok) {
        throw new Error("Failed to update user information");
      }
  
      const data = await response.json();
  
      if (data) {
        return { success: true, user: data };
      } else {
        throw new Error("Failed to update user.");
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  