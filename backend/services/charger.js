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
  static async getAllChargers({ status, powerOutput, connectorType, location, sort, name }) {
    // Build MongoDB query with $and logic (all filters must match)
    const filters = {};

    if (status) {
      filters.status = status;
    }

    if (powerOutput) {
      // Convert to number for proper comparison
      const powerValue = Number(powerOutput);
      if (!isNaN(powerValue)) {
        filters.powerOutput = powerValue;
      }
    }

    if (connectorType) {
      filters.connectorType = connectorType;
    }

    if (location) {
      filters.location = location;
    }

    if (name) {
      // Case-insensitive partial match for name
      filters.name = { $regex: name, $options: "i" };
    }

    // Initialize the query builder
    let chargerQuery = Charger.find(filters);

    // Handle sorting by createdAt
    if (sort) {
      const sortValue = sort.toLowerCase();
      if (sortValue === "newest") {
        chargerQuery = chargerQuery.sort({ createdAt: -1 });
      } else if (sortValue === "oldest") {
        chargerQuery = chargerQuery.sort({ createdAt: 1 });
      }
    }

    const chargers = await chargerQuery.exec();
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
