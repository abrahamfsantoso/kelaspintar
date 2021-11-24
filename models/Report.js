const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'Student',
    },
    grade: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    subject_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'Subject',
      required: true,
    },
    chapter_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'Chapter',
      required: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', ReportSchema);
