const mongoose = require('mongoose');

const ParkingSchema = new mongoose.Schema({
    parking_code: String,
    floor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FloorMaster',
    },
    slot_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SlotMaster',
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    date: {
        type: Date,
        default: new Date()
    },
    checked_in: {
        type: Date,
        default: null
    },
    checked_out: {
        type: Date,
        default: null
    }
});

const Parking = mongoose.model('Parking', ParkingSchema);
      
module.exports = Parking;