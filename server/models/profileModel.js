const mongoose = require('mongoose');

const Profile = mongoose.model(
  'Profile',
  new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    name: String,
    image: {
        type: String,
        default: 'default.png'
    },
    address: {
        type: String,
        default: null
    },
  })
);

module.exports = Profile;