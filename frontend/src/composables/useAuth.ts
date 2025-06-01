import { ref, computed } from "vue";

// Reactive token state
const token = ref<string | null>(localStorage.getItem("token"));

export const useAuth = () => {
  // Check if user is authenticated
  const isAuthenticated = computed(() => !!token.value);

  // Set token (when user logs in)
  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem("token", newToken);
  };

  // Remove token (when user logs out)
  const removeToken = () => {
    token.value = null;
    localStorage.removeItem("token");
  };

  // Get current token
  const getToken = () => token.value;

  return {
    token,
    isAuthenticated,
    setToken,
    removeToken,
    getToken,
  };
};
