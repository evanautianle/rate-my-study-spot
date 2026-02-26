import mongoose, { Schema, models } from "mongoose"

const RatingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  noise: Number,
  vibes: Number,
  outlets: Number,
  busyness: Number,
})

const CommentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now },
})

const SpotSchema = new Schema(
  {
    name: { type: String, required: true },
    building: { type: String, required: true },
    ratings: [RatingSchema],
    comments: [CommentSchema],
  },
  { timestamps: true }
)

export default models.Spot || mongoose.model("Spot", SpotSchema)