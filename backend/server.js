import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DBconn from "./db/db.js";
import userRouter from "./routes/user.js";
import chargerRouter from "./routes/charger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

DBconn();
// MongoDB Connection

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Evoltsoft API" });
});

app.use("/api/user", userRouter);
app.use("/api/charger", chargerRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
