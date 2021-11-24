const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema(
  {
    chapter_name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    grade: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    subject_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Subject',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chapter', ChapterSchema);
