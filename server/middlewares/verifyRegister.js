const db = require('../models');
const ROLES = db.ROLES,
      User = db.user;

checkDuplicateData = (req, res, next) => {
  //username
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: 'Failed! Username is already in use!' });
      return;
    }

    //email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: 'Failed! Email is already in use!' });
        return;
      }

      //phone number
      User.findOne({
        phoneNumber: req.body.phoneNumber
      }).exec((err, user)=>{
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if(user) {
          res.status(400).send({ message: 'Failed! Phone Number is already in use!' });
          return;
        }

        next();
      })
    });
  });
};

checkRoles = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

const verifyRegister = {
  checkDuplicateData,
  checkRoles
};

module.exports = verifyRegister;