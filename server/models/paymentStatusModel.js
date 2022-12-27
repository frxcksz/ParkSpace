const mongoose = require('mongoose');

const PaymentStatusSchema = new mongoose.Schema({
    parking_code: {
        type: String,
        ref: 'Parking',    
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    date: {
        type: Date,
        default: new Date()
    },
    status: {
        type: String,
        default: 'Unpaid'
    }
});

const PaymentStatus = mongoose.model('PaymentStatus', PaymentStatusSchema);
      
module.exports = PaymentStatus;