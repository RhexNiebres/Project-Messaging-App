export const checkUserExistence = async (username, email, userId) => {
    try {
      const response = await fetch(import.meta.env.VITE_HOST + "/users/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username, email, userId }),
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in checkUserExistence:", error); 
      return { success: false, error: error.message };
    }
  };
  