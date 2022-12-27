const db = require('../models');
const FloorMaster = db.floorMaster,
      SlotMaster = db.slotMaster,
      ParkingSlot = db.parkingSlot,
      Parking = db.parking;

checkSlot = (req, res, next) => {
  //parking
  FloorMaster.findOne({ name: req.body.floor }).exec((err, floor) => {
    if (err){
      res.status(500).send({ message: err });
    return;
    }

    if (!floor) {
      return res.status(404).send({ message: 'Floor Not Found.' });
    }
    SlotMaster.findOne({ name: req.body.slot }).exec((err, slot) => {
      if (err){
        res.status(500).send({ message: err });
      return;
      }
  
      if (!slot) {
        return res.status(404).send({ message: 'Slot Not Found.' });
      }
      
      ParkingSlot.findOne({ floor_id: floor._id, slot_id: slot._id }).exec((err, parkingSlot)=>{
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
    
        if (parkingSlot.status === 'Reserved') {
          res.status(400).send({ message: 'Failed! Parking Slot is already reserved!' });
          return;
        }

        if (parkingSlot.status === 'Filled') {
          res.status(400).send({ message: 'Failed! Parking Slot is already filled!' });
          return;
        }
        
        next();
      })
    });
  });
};

const verifyParking = {
  checkSlot
};

module.exports = verifyParking;