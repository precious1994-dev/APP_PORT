import mongoose from 'mongoose'

const SkillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    proficiency: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
    },
    description: String,
    icon: String,
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema) 