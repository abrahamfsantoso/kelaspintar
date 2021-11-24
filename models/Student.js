const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema(
  {
    name: {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', StudentSchema);
