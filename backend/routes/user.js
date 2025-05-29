import express from "express";
import UserController from "../controllers/user.js";

const userRouter = express.Router();

userRouter.post("/register", (req, res) => {
  return UserController.createUser(req, res);
});

userRouter.post("/login", (req, res) => {
  return UserController.loginUser(req, res);
});

export default userRouter;
