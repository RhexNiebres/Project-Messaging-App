export const fetchConversations = async (userId, recipientUserId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST}/users/${userId}/conversations${
        recipientUserId ? `?recipientUserId=${recipientUserId}` : ""
      }`,
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

    return { success: true, conversations: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
