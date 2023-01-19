import { model, Schema } from 'mongoose'

const authorSchema = new Schema(
  {
    name: { type: String, required: true },
    user: { type: String, required: true },
    channelURL: { type: String, required: true },
    userURL: { type: String, required: true },
    verified: { type: Boolean, required: true },
    subscribers: { type: String, required: true },
    videos: [{ type: Schema.Types.ObjectId, ref: 'Video' }]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const Author = model('Author', authorSchema)
