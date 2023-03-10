const mongoose = require('mongoose');

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    email: String,
    phoneNumber: String,
    username: String,
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
      }
    ]
  })
);

module.exports = User;