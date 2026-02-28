import { Wifi } from "lucide-react"
import mongoose, { Schema, models } from "mongoose"

const RatingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  value: { type: Number, required: true }, // overall rating
  noise: { type: Number }, // optional, 1-5
  comfort: { type: Number }, // optional, 1-5
  outletAvailability: { type: Number, enum: [0, 1, 2, 3] }, // 0=N/A, 1=Poor, 2=Mediocre, 3=Good
  wifiConnection: { type: Number, enum: [0, 1, 2, 3] }, // 0=N/A, 1=Poor, 2=Mediocre, 3=Good
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