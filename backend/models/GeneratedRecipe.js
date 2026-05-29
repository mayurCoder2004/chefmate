import mongoose from 'mongoose';

const generatedRecipeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  ingredients: {
    type: [String],
    required: true
  },
  recipeName: {
    type: String,
    required: true
  },
  aiProvider: {
    type: String,
    required: true
  },
  generationTime: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for analytics queries
generatedRecipeSchema.index({ createdAt: -1 });
generatedRecipeSchema.index({ userId: 1, createdAt: -1 });
generatedRecipeSchema.index({ aiProvider: 1 });
generatedRecipeSchema.index({ ingredients: 1 });

const GeneratedRecipe = mongoose.model('GeneratedRecipe', generatedRecipeSchema);

export default GeneratedRecipe;
