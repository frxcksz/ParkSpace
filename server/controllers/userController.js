const db = require('../models'),
      { user: User, profile: Profile, parkingSlot: ParkingSlot, floorMaster: FloorMaster, slotMaster: SlotMaster, parking: Parking, payment: Payment, paymentStatus: PaymentStatus } = db,
      jwt = require('jsonwebtoken'),
      random = require('random-string-alphanumeric-generator'),
      datentime = require('date-and-time'),
      axios = require('axios');

exports.allAccess = (req, res) => {
  res.status(200).send('Public Content.');
};

exports.userBoard = (req, res) => {
  let token = req.header('x-access-token');
  let decoded = jwt.decode(token);
  Profile.findOne({user_id: decoded.id}).exec((err, profile) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!profile) {
      return res.status(404).send({ message: 'Profile Not Found.' });
    }

    Parking.findOne({user_id: decoded.id, checked_out: null}).exec((err, parking) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      if (!parking) {
        return res.status(200).json({ message: 'Parking Not Found.', name: profile.name });
      }

      Parking.aggregate([
        {
          $match: { parking_code: parking.parking_code }
        },
        {
          $lookup:
          {
            from: "slotmasters",
            localField: "slot_id",
            foreignField: "_id",
            as: "slotData"
          }
        },
        {
          $lookup:
          {
            from: "floormasters",
            localField: "floor_id",
            foreignField: "_id",
            as: "floorData"
          }
        }
      ]).exec((err, parkingAggregate) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
    
        if (!parkingAggregate) {
          return res.status(404).send({ message: 'Parking Aggregate Not Found.' });
        }

        let raw = parkingAggregate;
        let floor_name, slot_name, floor_id, slot_id;
        raw.map((item) => {
          floor_name = item.floorData[0].name
          slot_name = item.slotData[0].name
          floor_id = item.floorData[0]._id
          slot_id = item.slotData[0]._id
        })
        
        
        let dateNow = new Date()
        if (parking.checked_in == null){
          parking.checked_in = dateNow
        }
        let timeValue = datentime.subtract(dateNow, parking.checked_in)
        let timeSecond = timeValue.toSeconds()
    
        let h = Math.floor(timeSecond / 3600);
        let m = Math.floor(timeSecond % 3600 / 60);
        let s = Math.floor(timeSecond % 3600 % 60);
        
        let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    
        let timeResult = hDisplay + mDisplay + sDisplay

        let cost = 2000
        for (let i = 3600; i < timeSecond; i+=3600){
          cost += 1000
        }

        if (timeResult == ''){
          timeResult = 'Go Check In'
          cost = 0
        }

        let longParking = '107.59224'
        let latParking = '-6.86443'
        
        let long = "107.72273"
        let lat = "-6.94161"
        const url = `https://router.project-osrm.org/route/v1/driving/${long},${lat};${longParking},${latParking}?overview=false`
        axios.get(url).then((response) =>{
          let responseDuration = Math.floor(response.data.routes[0].duration % 3600 / 60)
          let distance = Math.floor(response.data.routes[0].distance / 1000)

          let parkingDate = datentime.format(parking.date, 'hh:mmA')

          let parkingDateH = Number(parkingDate.match(/^(\d+)/)[1]);
          let parkingDateM = Number(parkingDate.match(/:(\d+)/)[1]);
          let parkingDateMD = parkingDate[5] + parkingDate[6];

          if(parkingDateMD == "PM" && parkingDateH < 12) parkingDateH = parkingDateH + 12;
          if(parkingDateMD == "AM" && parkingDateH == 12) parkingDateH = parkingDateH - 12;

          let sparkingDateH = parkingDateH.toString();
          let sparkingDateM = parkingDateM.toString();
          
          if(parkingDateH < 10) sparkingDateH = "0" + sparkingDateH;
          if(parkingDateM < 10) sparkingDateM = "0" + sparkingDateM;

          parkingDateString = sparkingDateH + ":" + sparkingDateM;

          res.status(200).json({
            success: true,
            name: profile.name,
            floor: floor_name,
            slot: slot_name,
            timeString: timeResult,
            total: cost,
            parking_code: parking.parking_code,
            timeStart: parkingDateString,
            duration: responseDuration,
            distance: distance
          })
          }).catch((error) => {
            res.status(200).json(error)
          })
      })
    })    
  });
};

exports.adminBoard = (req, res) => {
  res.status(200).send('Admin Content.');
};

exports.parkingDetail = (req, res) => {
  res.status(200).send('Parking Detail Content.');
};

exports.profile = (req, res) => {
  let token = req.header('x-access-token');
  let decoded = jwt.decode(token);
  User.findOne({_id: decoded.id}).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: 'User Not Found.' });
    }
    
    Profile.findOne({user_id: user._id}).exec((err, profile)=>{
      if (err){
        res.status(500).send({ message: err });
      return;
      }

      if (!profile) {
        return res.status(404).send({ message: 'Profile Not Found.' });
      }

      res.status(200).json({
        success: true,
        name: profile.name,
        email: user.email,
        username: user.username,
        phoneNumber: user.phoneNumber,
        image: profile.image,
        address: profile.address
      })
    })
  });
}

exports.parkingSlotByFloor = (req, res) => {
  FloorMaster.findOne({ name: req.params.floor.toUpperCase() }).exec((err, floor) => {
    if (err){
      res.status(500).send({ message: err });
    return;
    }

    if (!floor) {
      return res.status(404).send({ message: 'Floor Not Found.' });
    }

    ParkingSlot.aggregate([
      {
        $match: { floor_id : floor._id }
      },
      {
        $lookup:
        {
          from: "slotmasters",
          localField: "slot_id",
          foreignField: "_id",
          as: "slotData"
        }
      },
      {
        $sort:
        {
          "slotData.name": 1
        }
      }
    ]).exec((err, parkingSlot) => {
      if (err){
        res.status(500).send({ message: err });
      return;
      }
  
      if (!parkingSlot) {
        return res.status(404).send({ message: 'Parking Slot Not Found.' });
      }

      let raw = parkingSlot;
      let json = [];
      raw.map((item) => {
        data = {
          success: true,
          floor_id: item.floor_id,
          floor_name: floor.name,
          slot_id: item.slot_id,
          slot_name: item.slotData[0].name,
          status: item.status
        }
        json.push(data)
      })
      res.status(200).json(json)
      console.log(floor.name + ': ' + json.length)
    })
  })
};

exports.parking = (req, res) => {
  let token = req.header('x-access-token');
  let decoded = jwt.decode(token);
  Profile.findOne({user_id: decoded.id}).exec((err, profile) =>{
    if (err){
      res.status(500).send({ message: err });
    return;
    }

    if (!profile) {
      return res.status(404).send({ message: 'Profile Not Found.' });
    }

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
             
        ParkingSlot.aggregate([
          {
            $match: { floor_id : floor._id, slot_id : slot._id}
          },
          {
            $lookup:
            {
              from: "slotmasters",
              localField: "slot_id",
              foreignField: "_id",
              as: "slotData"
            }
          },
          // {$unwind: "slotData"},
          {
            $lookup:
            {
              from: "floormasters",
              localField: "floor_id",
              foreignField: "_id",
              as: "floorData"
            }
          }
        ]).exec((err, data) => {
          if (err){
            res.status(500).send({ message: err });
          return;
          }
      
          if (!data) {
            return res.status(404).send({ message: 'Data Not Found.' });
          }
      
          let raw = data;
          let floor_name, slot_name, floor_id, slot_id;
          raw.map((item) => {
            floor_name = item.floorData[0].name
            slot_name = item.slotData[0].name
            floor_id = item.floorData[0]._id
            slot_id = item.slotData[0]._id
          })
          
          //console.log(floor_name + ' ' + slot_name)
  
          let randomAlphNmrc = random.randomAlphanumeric(4, 'uppercase');
          let slotNumberCode = String(slot_name).padStart(3, '0')
          let parkingCode = 'PS' + floor_name + slotNumberCode + randomAlphNmrc;
          
          let token = req.header('x-access-token');
          let decoded = jwt.decode(token);
  
          let save = {
            parking_code: parkingCode,
            floor_id: floor_id,
            slot_id: slot_id,
            user_id: decoded.id
          }
  
          let json = []
  
          const parking = new Parking(save);
          parking.save((err)=>{
            if (err){
              res.status(500).send({ message: err });
              return;
            } else {
              //json.push(save)
              ParkingSlot.findOne({ floor_id: floor_id, slot_id: slot_id }, (err, found_parkingSlot) => {
                if (err) {
                  return res.status(404).json({
                      err,
                      message: 'Parking Slot not found!',
                  })
                }
                found_parkingSlot.status = 'Reserved'
                found_parkingSlot.save().then(() => {
                  save.parking_status = 'Reserved'
                  save.name = profile.name
                  json.push(save)
                  res.status(200).json(json)
                  })
                  .catch(error => {
                      return res.status(404).json({
                          error,
                          message: 'Parking Slot not updated!',
                      })
                  })
              })
            }
          });
        })
      });
    });
  });
};

exports.checkIn = (req, res) => {
  let json = []
  let response = {}
  Parking.findOne({ parking_code: req.body.parking_code }).exec((err, parking) => {
    if (err){
      res.status(500).send({ message: err });
    return;
    }

    if (!parking) {
      return res.status(404).send({ message: 'Parking Not Found.' });
    }
    
    parking.checked_in = new Date()
    parking.save().then(() => {
      response.checked_in = parking.checked_in
      ParkingSlot.findOne({ floor_id: parking.floor_id, slot_id: parking.slot_id }, (err, parkingSlot) => {
        if (err) {
          return res.status(404).json({
              err,
              message: 'Parking Slot not found!',
          })
        }
        parkingSlot.status = 'Filled'
        parkingSlot.save().then(() => {
          response.parking_status = parkingSlot.status
          json.push(response)
          res.status(200).json(json)
          })
          .catch(error => {
              return res.status(404).json({
                  error,
                  message: 'Parking Slot not updated!',
              })
          })
      })
    })
    .catch(error => {
      return res.status(404).json({
        error,
        message: 'Parking not updated!',
      })
    })
  })
};

exports.checkPayment = (req, res) => {
  Parking.findOne({ parking_code: req.body.parking_code }).exec(async (err, parking) => {
    if (err){
      res.status(500).send({ message: err });
    return;
    }
  
    if (!parking) {
      return res.status(404).send({ message: 'Parking Not Found.' });
    }

    let dateNow = new Date()
    let timeValue = datentime.subtract(dateNow, parking.checked_in)
    let timeSecond = timeValue.toSeconds()

    let h = Math.floor(timeSecond / 3600);
    let m = Math.floor(timeSecond % 3600 / 60);
    let s = Math.floor(timeSecond % 3600 % 60);
    
    let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

    let timeResult = hDisplay + mDisplay + sDisplay

    let cost = 2000
    for (let i = 3600; i < timeSecond; i+=3600){
      cost += 1000
    }

    let save = {
      parking_code: parking.parking_code,
      time: timeSecond,
      total: cost
    }

    save.timeString = timeResult

    let json = []

    let paymentOld = await Payment.findOne({ parking_code: parking.parking_code });

    const payment = new Payment(save);
    payment.save(async (err)=>{
      if (err){
        res.status(500).send({ message: err });
        return;
      } else {
        if (paymentOld != null){
          Payment.findByIdAndRemove(paymentOld._id, { useFindAndModify: false }).exec();
        }

        let paymentStatusOld = await PaymentStatus.findOne({ parking_code: parking.parking_code });

        const paymentStatus = new PaymentStatus({parking_code: parking.parking_code});
        paymentStatus.save((err) => {
          if (err){
            res.status(500).send({ message: err });
            return;
          } else {
            if (paymentStatusOld != null){
              PaymentStatus.findByIdAndRemove(paymentStatusOld._id, { useFindAndModify: false }).exec();
            }
            PaymentStatus.findOne({ parking_code: parking.parking_code }, (err, paymentStatus) => {
              if (err) {
                return res.status(404).json({
                  err,
                  message: 'Payment Status not found!'
                })
              } else {
                save.paymentStatus = paymentStatus.status
                json.push(save)
                res.status(200).json(json)
              }
            })
          }
        })
      }
    });
  })
};

exports.checkOut = async (req, res) => {
  let json = []
  let response = {}
  let paymentColl = await Payment.findOne({ parking_code: req.body.parking_code });
  if (req.body.pay < paymentColl.total){
    res.status(200).send({ message: 'Insufficient balance.' })
  } else {
    response.return_balance = req.body.pay - paymentColl.total
    Parking.findOne({ parking_code: req.body.parking_code }).exec((err, parking) => {
      if (err){
        res.status(500).send({ message: err });
      return;
      }
  
      if (!parking) {
        return res.status(404).send({ message: 'Parking Not Found.' });
      }
      
      parking.checked_out = new Date()
      parking.save().then(() => {
        response.checked_out = parking.checked_out
        ParkingSlot.findOne({ floor_id: parking.floor_id, slot_id: parking.slot_id }, (err, parkingSlot) => {
          if (err) {
            return res.status(404).json({
                err,
                message: 'Parking Slot not found!',
            })
          }
          parkingSlot.status = 'Available'
          parkingSlot.save().then(() => {
            response.parking_status = parkingSlot.status
            PaymentStatus.findOne({ parking_code: parking.parking_code }, (err, paymentStatus) => {
              if (err) {
                return res.status(404).json({
                  err,
                  message: 'Payment Status not found!'
                })
              }
  
              let token = req.header('x-access-token');
              let decoded = jwt.decode(token);
  
              paymentStatus.admin_id = decoded.id
              paymentStatus.date = new Date()
              paymentStatus.status = 'Paid'
              paymentStatus.save().then(() => {
                response.paymentAdmin = paymentStatus.admin_id
                response.paymentDate = paymentStatus.date
                response.paymentStatus = paymentStatus.status
                json.push(response)
                res.status(200).json(json)
              })
              .catch(error => {
                return res.status(404).json({
                  error,
                  message: 'Payment Status not updated!'
                })
              })
            })
          })
          .catch(error => {
              return res.status(404).json({
                  error,
                  message: 'Parking Slot not updated!',
              })
          })
        })
      })
      .catch(error => {
        return res.status(404).json({
          error,
          message: 'Parking not updated!',
        })
      })
    })
  }
};

exports.paymentStatus = (req, res) => {
  Payment.findOne({ parking_code:  req.params.parking_code }).exec((err, payment) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!payment) {
      return res.status(404).send({ message: 'Payment Not Found.' });
    }
    
    let timeSecond = payment.time

    let h = Math.floor(timeSecond / 3600);
    let m = Math.floor(timeSecond % 3600 / 60);
    let s = Math.floor(timeSecond % 3600 % 60);
    
    let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

    let timeResult = hDisplay + mDisplay + sDisplay

    PaymentStatus.findOne({ parking_code:  req.params.parking_code }).exec((err, paymentStatus) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      if (!payment) {
        return res.status(404).send({ message: 'Payment Not Found.' });
      }

      res.status(200).json({
        success: true,
        parking_code: payment.parking_code,
        timeSecond: timeSecond,
        timeString: timeResult,
        total: payment.total,
        date: payment.date,
        status: paymentStatus.status
      })
    })
  })
};

exports.checkDistance = async (req, res) => {
  let longParking = '107.59224'
  let latParking = '-6.86443'
  
  let long = req.body.long //"long": "107.72273"
  let lat = req.body.lat //"lat": "-6.94161"
  const url = `https://router.project-osrm.org/route/v1/driving/${long},${lat};${longParking},${latParking}?overview=false`
  axios.get(url).then((response) =>{
    let responseDuration = response.data.routes[0].duration
    let distance = Math.floor(response.data.routes[0].distance / 1000)
    let distanceString = distance + ' km'

    let h = Math.floor(responseDuration / 3600);
    let m = Math.floor(responseDuration % 3600 / 60);
    let s = Math.floor(responseDuration % 3600 % 60);
    
    let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

    let timeResult = hDisplay + mDisplay + sDisplay

    let data = {
      duration: timeResult,
      distance: distanceString
    }

    res.status(200).json(data);
  }).catch((error) => {
    res.status(200).json(error)
  })
};

// exports.previewTicket = (req, res) => {
// };