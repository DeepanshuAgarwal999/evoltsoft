
import UserService from "../services/user.js";

class UserController {
  static async createUser(req, res) {
    try {
      const randomNumber = Math.floor(Math.random() * 10000);
      const { name = `User ${randomNumber}`, email, password, phone } = req.body;
      if (!email?.trim() && !phone?.trim()) {
        return res.status(400).json({ message: "Please provide either email or phone" });
      }
      if (!password?.trim()) {
        return res.status(400).json({ message: "Password is required" });
      }
      const user = await UserService.createUser({ name, email, password, phone });
      res.status(201).json(user);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation failed",
          errors: Object.values(error.errors).map((err) => err.message),
        });
      }
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ message: error.message });
    }
  }

  static async loginUser(req, res) {
    try {
      const { email, password, phone } = req.body;

      if (!email?.trim() && !phone?.trim()) {
        return res.status(400).json({ message: "Please provide either email or phone" });
      }

      const user = await UserService.loginUser({ email, password, phone });
      res.status(200).json(user);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Validation failed",
          errors: Object.values(error.errors).map((err) => err.message),
        });
      }
      console.log(error);
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ message: error.message });
    }
  }
}
export default UserController;
