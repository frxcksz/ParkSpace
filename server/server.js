const { slotMaster } = require('./models');

require('dotenv').config({path: '../config.env'})
const express = require('express'),
      cors = require('cors'),
      app = express(),
      db = require('./models'),
      Role = db.role,
      FloorMaster = db.floorMaster,
      SlotMaster = db.slotMaster,
      ParkingSlot = db.parkingSlot,
      apiPort = process.env.PORT || 8000;
      
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

db.mongoose
  .set('strictQuery', false)
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connection Success!');
    initial();
  })
  .catch(err => {
    console.error('MongoDB Connection Failed!', err);
    process.exit(1);
  });

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ParkSpace API.' });
});

// routes
require('./routes/authRoutes')(app);
require('./routes/userRoutes')(app);

// listen for requests
app.listen(apiPort, () => {
  console.log(`Server is running on port: ${apiPort}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user'
      }).save(err => {
        if (err) {
          console.log('error', err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: 'admin'
      }).save(err => {
        if (err) {
          console.log('error', err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
  FloorMaster.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new FloorMaster({
        name: 'A'
      }).save(err => {
        if (err) {
          console.log('error', err);
        }

        console.log("added 'A' to floor master collection");
      });

      new FloorMaster({
        name: 'B'
      }).save(err => {
        if (err) {
          console.log('error', err);
        }

        console.log("added 'B' to floor master collection");
      });

      new FloorMaster({
        name: 'C'
      }).save(err => {
        if (err) {
          console.log('error', err);
        }

        console.log("added 'C' to floor master collection");
      });

      new FloorMaster({
        name: 'D'
      }).save(err => {
        if (err) {
          console.log('error', err);
        }

        console.log("added 'D' to floor master collection");
      });
    }
  });
  SlotMaster.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      for (let i = 1; i <= 44; i++) {
        new SlotMaster({
          name: i
        }).save(err => {
          if (err) {
            console.log('error', err)
          }

          console.log(`added '${i}' to slot master collection`);
        })
      }
    }
  });
  ParkingSlot.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      FloorMaster.find({}).exec((err, floorMaster) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
    
        if (!floorMaster) {
          return res.status(404).send({ message: 'Floor Not Found.' });
        }
        
        SlotMaster.find({}).exec((err, slotMaster) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
      
          if (!slotMaster) {
            return res.status(404).send({ message: 'Slot Not Found.' });
          }

          // for (let i = 0; i < floorMaster.length; i++){
          //   for (let j = 0; j < slotMaster.length; j++){
          //     console.log(slotMaster[j]);
          //   }
          //   console.log(floorMaster[i]);
          // }

          for (let i = 0; i < floorMaster.length; i++) {
            for (let j = 0; j < slotMaster.length; j++){
              new ParkingSlot({
                floor_id: floorMaster[i]._id,
                //floor_name: floorMaster[i].name,
                slot_id: slotMaster[j]._id,
                //slot_name: slotMaster[j].name
              }).save(err => {
                if (err) {
                  console.log('error', err)
                }
      
                console.log(`added '${floorMaster[i].name}': '${slotMaster[j].name}' to parking slot collection`)
              })
            }
          }
        })

        
      })
    }
  });
}