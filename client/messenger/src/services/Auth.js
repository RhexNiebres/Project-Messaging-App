export const signup = async (credentials) => {
  const response = await fetch(import.meta.env.VITE_HOST + "/sign-up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Signup failed");
  }

  const data = await response.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.userId);

  window.location.href = "/login";
  return data;
};

export const login = async (credentials) => {
  const response = await fetch(import.meta.env.VITE_HOST + "/log-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  const data = await response.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.userId);

  window.location.href = "/home";
  return data;
};

export const getToken = () => localStorage.getItem("token");

export const getUserId = () => localStorage.getItem("userId");
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.href = "/";
};

export const isAuthenticated = () => !!getToken();
export const getUserRole = () => localStorage.getItem("role");

export const getUser = async () => {
  const token = getToken();
  if (!token) return null;

  const response = await fetch(import.meta.env.VITE_HOST + "/user", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    logout();
    return null;
  }

  return response.json();
};
