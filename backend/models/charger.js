import mongoose from "mongoose";

const chargerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Inactive",
    },
    powerOutput: {
      type: Number,
      required: true,
      min: 0,
      unit: "kW",
    },
    connectorType: {
      type: String,
      required: true,
      enum: ["Type 1", "Type 2", "CCS", "CHAdeMO", "Tesla Supercharger"],
    },
  },
  {
    timestamps: true,
  }
);

const Charger = mongoose.model("Charger", chargerSchema);

export default Charger;
