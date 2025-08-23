import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  usedIngredients: { type: [String], default: [] },
  optionalIngredients: { type: [String], default: [] },
  healthBenefits: { type: [String], default: [] }, // ← Fixed: array of strings
  cookingSteps: { type: [String], default: [] },
  estimatedTime: { type: Number },
  servings: { type: Number },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    preferences: { type: [String], default: [] },
    savedRecipes: { type: [RecipeSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
