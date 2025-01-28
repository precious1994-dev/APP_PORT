import mongoose from 'mongoose'

const AboutSchema = new mongoose.Schema(
  {
    bio: {
      type: String,
      required: true,
    },
    shortBio: {
      type: String,
      required: true,
    },
    skills: [
      {
        category: {
          type: String,
          required: true,
        },
        items: {
          type: [String],
          required: true,
        },
      },
    ],
    socialLinks: {
      github: String,
      linkedin: String,
      dribbble: String,
      email: String,
    },
    resumeUrl: String,
  },
  { timestamps: true }
)

export default mongoose.models.About || mongoose.model('About', AboutSchema) 