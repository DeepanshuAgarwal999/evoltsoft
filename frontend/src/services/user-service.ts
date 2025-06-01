import axiosInstance from "@/config/axios.instance";
import { useAuth } from "@/composables/useAuth";

class UserService {
  static async loginUser({ email, password, phone }: { email?: string; phone?: string; password: string }) {
    const response = await axiosInstance.post("/api/user/login", { email, password, phone });

    // Store token if login successful
    if (response.data?.token) {
      const { setToken } = useAuth();
      setToken(response.data.token);
    }

    return response.data;
  }

  static async registerUser({ email, name, password, phone }: { email?: string; name?: string; password: string; phone?: string }) {
    const response = await axiosInstance.post("/api/user/register", { email, name, password, phone });
    return response.data;
  }

  static async logout() {
    const { removeToken } = useAuth();
    removeToken();
  }
}

export default UserService;
