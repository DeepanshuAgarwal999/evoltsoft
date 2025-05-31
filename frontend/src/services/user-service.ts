import axiosInstance from "@/config/axios.instance";

class UserService {
  static async loginUser({ email, password, phone }: { email?: string; phone?: string; password: string }) {
    const response = await axiosInstance.post("/api/user/login", { email, password, phone });
    return response.data;
  }
  static async registerUser({ email, name, password, phone }: { email?: string; name?: string; password: string; phone?: string }) {
    const response = await axiosInstance.post("/api/user/register", { email, name, password, phone });
    return response.data;
  }
}

export default UserService;
