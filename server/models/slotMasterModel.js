const mongoose = require('mongoose');

const SlotMaster = mongoose.model(
  'SlotMaster',
  new mongoose.Schema({
    name: Number
  })
);

module.exports = SlotMaster;