import mongoose from "mongoose";

const recipeFeedbackSchema = new mongoose.Schema({
  recipeName: {
    type: String,
    required: true
  },
  ingredients: {
    type: [String],
    required: true
  },
  rating: {
    type: String,
    required: true,
    enum: ["helpful", "not_helpful"]
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const RecipeFeedback = mongoose.model("RecipeFeedback", recipeFeedbackSchema);

export default RecipeFeedback;
