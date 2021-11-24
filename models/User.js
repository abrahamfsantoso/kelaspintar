const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      unique: true,
    },
    middleName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      required: true,
      enum: ['teacher', 'student'],
      default: 'student',
    },
    grade: {
      type: Number,
      min: 1,
      max: 12,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
