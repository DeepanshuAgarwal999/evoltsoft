import bcrypt from "bcryptjs";
import User from "../models/user.js";
import throwCustomError from "../lib/error.js";
import createToken from "../lib/token.js";

class UserService {
  static async createUser({ name, email, password, phone }) {
    const query = [];
    if (email) query.push({ email });
    if (phone) query.push({ phone });

    const isUserExist = await User.findOne({ $or: query });

    if (isUserExist) {
      throwCustomError("User already exist", 409);
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
      throwCustomError("User not found", 404);
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throwCustomError("Invalid password", 401);
    }
    const token = createToken(user._id);
    const { password: _password, ...restInfo } = user.toJSON();
    return { user: restInfo, token };
  }
}

export default UserService;
