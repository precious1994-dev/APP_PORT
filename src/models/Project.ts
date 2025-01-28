import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
  links: {
    github: String,
    live: String,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
})

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema) 