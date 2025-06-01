import axiosInstance from "@/config/axios.instance";

class ChargerService {
  static async getChargerById(id: string) {
    const response = await axiosInstance.get(`/api/charger/${id}`);
    return response.data;
  }
  static async getAllChargers(params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : "";
    const url = queryString ? `/api/charger?${queryString}` : "/api/charger";
    console.log("Fetching chargers with URL:", url);
    console.log("Filter params:", params);

    const response = await axiosInstance.get(url);
    console.log("API Response:", response.data);

    // Handle both old and new response formats
    if (response.data.success) {
      return response.data; // New format: { success: true, data: [...], count: n }
    } else {
      // Old format: direct array or { data: [...] }
      return response.data;
    }
  }
  static async createCharger(charger: any) {
    const response = await axiosInstance.post("/api/charger", charger);
    return response.data;
  }
  static async updateChargerById(id: string, charger: any) {
    const response = await axiosInstance.put(`/api/charger/${id}`, charger);
    return response.data;
  }
  static async deleteCharger(id: string) {
    const response = await axiosInstance.delete(`/api/charger/${id}`);
    return response.data;
  }
}

export default ChargerService;
