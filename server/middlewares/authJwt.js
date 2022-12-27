require('dotenv').config({path: '../../config.env'})
const jwt = require('jsonwebtoken'),
      db = require('../models'),
      User = db.user,
      Role = db.role,
      { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError){
    return res.status(401).send({ message: 'Unauthorized! Access Token was expired!'});
  }

  return res.sendStatus(401).send({ message: 'Unauthorized!' });
}

const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'admin') {
            next();
            return;
          }
        }

        res.status(403).send({ message: 'Require Admin Role!' });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin
};

module.exports = authJwt;