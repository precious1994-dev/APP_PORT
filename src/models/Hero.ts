import mongoose from 'mongoose'

const HeroSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    phrases: {
      type: [String],
      required: true,
    },
    ctaButtons: [
      {
        label: {
          type: String,
          required: true,
        },
        href: {
          type: String,
          required: true,
        },
      },
    ],
    socialLinks: {
      github: {
        type: String,
        default: '',
      },
      linkedin: {
        type: String,
        default: '',
      },
      dribbble: {
        type: String,
        default: '',
      },
    },
  },
  { timestamps: true }
)

export default mongoose.models.Hero || mongoose.model('Hero', HeroSchema) 