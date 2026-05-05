import mongoose from "mongoose";

const SharedRecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  usedIngredients: { type: [String], default: [] },
  optionalIngredients: { type: [String], default: [] },
  healthBenefits: { type: [String], default: [] },
  cookingSteps: { type: [String], default: [] },
  estimatedTime: { type: Number },
  servings: { type: Number },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("SharedRecipe", SharedRecipeSchema);
