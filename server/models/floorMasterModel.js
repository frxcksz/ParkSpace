const mongoose = require('mongoose');

const FloorMaster = mongoose.model(
  'FloorMaster',
  new mongoose.Schema({
    name: String
  })
);

module.exports = FloorMaster;