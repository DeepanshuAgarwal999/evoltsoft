import throwCustomError from "../lib/error.js";
import Charger from "../models/charger.js";

class ChargerService {
  static async createCharger(credentials) {
    const isChargerExist = await Charger.findOne({ name: credentials.name });
    if (isChargerExist) {
      throwCustomError("Charger already exists", 409);
    }
    const charger = new Charger(credentials);
    await charger.save();
    return charger;
  }

  static async getChargerById(id) {
    const charger = await Charger.findById(id);
    if (!charger) {
      throwCustomError("Charger not found", 404);
    }
    return charger;
  }

  static async getAllChargers() {
    const chargers = await Charger.find();
    return chargers;
  }

  static async deleteChargerById(id) {
    const charger = await Charger.findByIdAndDelete(id);
    if (!charger) {
      throwCustomError("Charger not found", 404);
    }
    return charger;
  }

  static async updateChargerById(id, changes) {
    const charger = await Charger.findByIdAndUpdate(id, changes, { new: true });
    if (!charger) {
      throwCustomError("Charger not found", 404);
    }
    return charger;
  }
}

export default ChargerService;
