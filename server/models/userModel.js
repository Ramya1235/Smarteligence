const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  facility: {
    type: String,
    required: true,
  },
  associateId: {
    type: Number,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    requried: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  checkInDates: {
    type: [Date],
  },
});

module.exports = new mongoose.model("users", userSchema);
