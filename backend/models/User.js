import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    preferences: { type: [String], default: [] }, // e.g., vegetarian, vegan, keto
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);