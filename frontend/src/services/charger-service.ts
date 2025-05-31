import axiosInstance from "@/config/axios.instance";

class ChargerService {
  static async getChargerById(id: string) {
    const response = await axiosInstance.get(`/api/charger/${id}`);
    return response.data;
  }
  static async getAllChargers() {
    const response = await axiosInstance.get("/api/charger");
    return response.data;
  }
  static async createCharger(charger: any) {
    const response = await axiosInstance.post("/api/charger", charger);
    return response.data;
  }
  static async updateChargerById(id: string, charger: any) {
    const response = await axiosInstance.put(`/api/charger/${id}`, charger);
    return response.data;
  }
}

export default ChargerService;
