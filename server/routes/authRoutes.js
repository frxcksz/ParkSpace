const { verifyRegister } = require('../middlewares'),
      AuthController = require('../controllers/authController');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.post(
    '/api/auth/register',
    [
      verifyRegister.checkDuplicateData,
      verifyRegister.checkRoles
    ],
    AuthController.register
  );

  app.post('/api/auth/login', AuthController.login);

  app.post('/api/auth/refreshtoken', AuthController.refreshToken);

  app.post('/api/auth/logout', AuthController.logout);
};