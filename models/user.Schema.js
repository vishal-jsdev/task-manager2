const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    date: {
        type: Date,
    }
  },
  {
    timestamps: true,
  }
);
userSchema.index({date:1})
const User = mongoose.model('User', userSchema);
module.exports = User;