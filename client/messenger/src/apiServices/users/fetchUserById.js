export const fetchUsersById = async () => {
  try {
    const response = await fetch(import.meta.env.VITE_HOST + `/users/${id}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const data = await response.json();

    if (data) {
      return { success: true, user: data };
    } else {
      throw new Error("User not found");
    }
  } catch {
    return { success: false, error: error.message };
  }
};
