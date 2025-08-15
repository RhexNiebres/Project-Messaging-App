export const fetchUsers = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_HOST}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();

    if (data) {
      return { success: true, user: data };
    } else {
      throw new Error("user not found.");
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
