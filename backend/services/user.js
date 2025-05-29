import bcrypt from "bcryptjs";
import User from "../models/user.js";

class UserService {
  static async createUser({ name, email, password, phone }) {
    const query = [];
    if (email) query.push({ email });
    if (phone) query.push({ phone });

    const isUserExist = await User.findOne({ $or: query });

    if (isUserExist) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, phone });
    await user.save();
    return user;
  }

  static async loginUser({ email, password, phone }) {
    const query = [];
    if (email) query.push({ email });
    if (phone) query.push({ phone });

    const user = await User.findOne({ $or: query });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }
    const { password: userPassword, ...restInfo } = user.toJSON();
    return {
      user: restInfo,
    };
  }
}

export default UserService;
