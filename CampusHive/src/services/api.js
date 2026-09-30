// backend URLs
export const API_URL = "http://localhost:5000/api";

export const SERVER_URL = "http://localhost:5000";

// localStorage helpers
export function saveSession(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  }
  return null;
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
