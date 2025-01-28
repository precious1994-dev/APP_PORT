import { Schema, model, models } from 'mongoose'

const experienceSchema = new Schema({
  company: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  highlights: {
    type: [String],
    default: [],
  },
  url: {
    type: String,
  },
  order: {
    type: Number,
    required: true,
  },
})

const Experience = models.Experience || model('Experience', experienceSchema)

export default Experience 