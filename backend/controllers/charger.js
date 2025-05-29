import ChargerService from "../services/charger.js";

class ChargerController {
  static async createCharger(req, res) {
    try {
      const { name, location, status, powerOutput, connectorType } = req.body;
      if (!name?.trim()) {
        return res.status(400).json({ message: "Name is required" });
      }
      if (!location?.latitude || !location?.longitude) {
        return res.status(400).json({ message: "Location with latitude and longitude is required" });
      }
      if (!powerOutput || typeof powerOutput !== "number") {
        return res.status(400).json({ message: "Power output must be a number" });
      }
      if (!connectorType?.trim()) {
        return res.status(400).json({ message: "Connector type is required" });
      }
      const charger = await ChargerService.createCharger({ name, location, status, powerOutput, connectorType });
      return res.status(201).json(charger);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation failed",
          errors: Object.values(error.errors).map((err) => err.message),
        });
      }
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({ message: error.message });
    }
  }
  static async getChargerById(req, res) {
    try {
      const charger = await ChargerService.getChargerById(req.params.id);
      return res.json(charger);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({ message: error.message });
    }
  }
  static async getAllChargers(req, res) {
    try {
      const chargers = await ChargerService.getAllChargers();
      return res.json(chargers);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({ message: error.message });
    }
  }
  static async deleteChargerById(req, res) {
    try {
      await ChargerService.deleteChargerById(req.params.id);
      return res.status(204).send();
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({ message: error.message });
    }
  }
  static async updateChargerById(req, res) {
    try {
      const { name, location, status, powerOutput, connectorType } = req.body;
      const changes = { name, location, status, powerOutput, connectorType };
      const charger = await ChargerService.updateChargerById(req.params.id, changes);
      return res.status(200).json(charger);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation failed",
          errors: Object.values(error.errors).map((err) => err.message),
        });
      }
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({ message: error.message });
    }
  }
}

export default ChargerController;
