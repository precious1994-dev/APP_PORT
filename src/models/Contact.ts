import mongoose from 'mongoose'

const ContactSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
      dribbble: String,
    },
    formspreeEndpoint: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema) 