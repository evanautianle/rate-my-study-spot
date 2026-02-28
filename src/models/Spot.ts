import mongoose, { Schema, models } from "mongoose";

// Sub-schema for individual ratings
const RatingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  quietness: { type: Number, min: 1, max: 5, required: true },
  comfort: { type: Number, min: 1, max: 5, required: true },
  seatAvailability: { type: Number, enum: [0, 1, 2, 3, 4], required: true }, // 0=N/A, 4=Excellent
  outletAvailability: { type: Number, enum: [0, 1, 2, 3], required: true }, // 0=N/A
  wifiConnection: { type: Number, enum: [0, 1, 2, 3, 4], required: true },   // 0=N/A
  overallRating: { type: Number, min: 1, max: 5, required: true }, // pre-calculated
  createdAt: { type: Date, default: Date.now },
});

// Sub-schema for comments
const CommentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Main Spot schema
const SpotSchema = new Schema(
  {
    name: { type: String, required: true },
    building: { type: String, required: true },
    ratings: [RatingSchema],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

export default models.Spot || mongoose.model("Spot", SpotSchema);