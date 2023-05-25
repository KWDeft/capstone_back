import mongoose, { Schema } from 'mongoose';

const CourseSchema = new Schema(
  {
    title: String,
    detail: String,
    content: String,
    effect: String,
    file_video: {
      type: [String],
      default: [],
    },
    attachment: {
      type: [String],
      default: ['https://cdn-icons-png.flaticon.com/128/1380/1380641.png'],
    },
  },
  {
    timestamps: true,
  },
);

const Course = mongoose.model('Course', CourseSchema);
export default Course;
