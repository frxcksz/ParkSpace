const mongoose = require('mongoose');

const ParkingSlotSchema = new mongoose.Schema({
    floor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FloorMaster',
    },
    slot_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SlotMaster',
    },
    status: {
        type: String,
        default: 'Available',
    },
});

const ParkingSlot = mongoose.model('ParkingSlot', ParkingSlotSchema);
      
module.exports = ParkingSlot;