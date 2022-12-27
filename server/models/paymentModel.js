const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    parking_code: {
        type: String,
        ref: 'Parking',    
    },
    time: Number,
    total: Number,
    date: {
        type: Date,
        default: new Date()
    }
});

const Payment = mongoose.model('Payment', PaymentSchema);
      
module.exports = Payment;