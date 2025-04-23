export const fetchMessagesByConversationId = async (conversationId) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_HOST + `/${conversationId}/messages`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    const data = await response.json();
    return { success: true, messages: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
