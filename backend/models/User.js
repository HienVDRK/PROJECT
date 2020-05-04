const mongoose = require('mongoose')

const Schema = mongoose.Schema;

let User = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  confirmed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', User);