const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema(
  {
    subject_name: {
      type: String,
      required: true,
      enum: ['Math', 'English', 'Indonesian', 'Science'],
    },
    grade: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subject', SubjectSchema);
