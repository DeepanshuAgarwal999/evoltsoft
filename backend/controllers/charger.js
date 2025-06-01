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
      console.log(error);
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
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Id is required" });
      }
      const charger = await ChargerService.getChargerById(id);
      return res.json(charger);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({ message: error.message });
    }
  }
  static async getAllChargers(req, res) {
    try {
      const { status, powerOutput, connectorType, location, sort, name } = req.query;
      console.log("Filter params received:", { status, powerOutput, connectorType, location, sort, name });

      const chargers = await ChargerService.getAllChargers({ status, powerOutput, connectorType, location, sort, name });

      // Return consistent response format
      return res.json({
        success: true,
        data: chargers,
        count: chargers.length,
      });
    } catch (error) {
      console.error("Error in getAllChargers:", error);
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }
  static async deleteChargerById(req, res) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Id is required" });
      }
      await ChargerService.deleteChargerById(id);
      return res.status(204).send();
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({ message: error.message });
    }
  }
  static async updateChargerById(req, res) {
    try {
      const { name, location, status, powerOutput, connectorType } = req.body;
      const options = { name, location, status, powerOutput, connectorType };
      const updatedCharger = await ChargerService.updateChargerById(req.params.id, options);
      return res.status(200).json(updatedCharger);
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
