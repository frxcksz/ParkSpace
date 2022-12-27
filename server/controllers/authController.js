require('dotenv').config({path: '../../config.env'})
const db = require('../models'),
      { user: User, role: Role, profile: Profile, refreshToken: RefreshToken } = db;

let jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt');

exports.register = (req, res) => {
  const user = new User({
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    const profile = new Profile({
      user_id: user._id,
      name: req.body.name
    });
    profile.save((err)=>{
      if (err){
        res.status(500).send({ message: err });
        return;
      } else {
        messageProfile = 'Profile'
      }
    });

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: `User and ${messageProfile} was registered successfully!` });
          });
        }
      );
    } else {
      Role.findOne({ name: 'user' }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: `User and ${messageProfile} was registered successfully!` });
        });
      });
    }
  });
};

exports.login = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate('roles', '-__v')
    .exec(async (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: 'Username Not found.' });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!'
        });
      }

      let token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 43200, //12 hour
      });

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push('ROLE_' + user.roles[i].name.toUpperCase());
      }

      let profile = Profile.findOne({ user_id: user._id })
      res.status(200).send({
        id: user._id,
        name: profile.name,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken
      });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null){
    return res.status(403).json({ message: 'Refresh Token is required' });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
      
      res.status(403).json({
        message: "Refresh token was expired. Please make a new login request",
      });
      return;
    }

    let newAccessToken = jwt.sign({ id: refreshToken.user._id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 43200, //12 hour
    });

    let newToken = await RefreshToken.createToken(refreshToken.user);
    RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newToken,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

exports.logout = (req, res) => {
  RefreshToken.findOneAndDelete({token: req.body.token}).exec((err, refreshToken) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!refreshToken) {
      return res.status(404).send({ message: 'Token Not Found.' });
    }
    
    res.status(200).json({
      success: true,
      message: "Logout was successfully!"
    })
  });
};