import { model, Schema } from 'mongoose'

const videoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true, default: '' },
  videoDuration: { type: String, required: true },
  isFamilySafe: { type: Boolean, required: true },
  viewCount: { type: Number, required: true },
  category: { type: String, required: true },
  publishDate: { type: String, required: true },
  keywords: { type: [String], required: true },
  author: { type: Schema.Types.ObjectId, required: true },
  isPrivate: { type: Boolean, required: true },
  isLoveContent: { type: Boolean, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  ageRestricted: { type: Boolean, required: false },
  videoURL: { type: String, required: true }
})
