export const fetchConversations = async (userId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST}/users/${userId}/conversations`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch conversations");
    }

    const data = await response.json();

    return { success: true, conversations: data.conversationIds };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
