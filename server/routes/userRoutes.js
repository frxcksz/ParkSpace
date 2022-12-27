const { authJwt, verifyParking } = require('../middlewares'),
      UserController = require('../controllers/userController');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.get('/api/test/all', UserController.allAccess);

  app.get('/api/user', [authJwt.verifyToken], UserController.userBoard);

  app.get('/api/profile', [authJwt.verifyToken], UserController.profile);

  app.get('/api/parkingSlot/:floor', [authJwt.verifyToken], UserController.parkingSlotByFloor);

  app.post('/api/parking', [authJwt.verifyToken, verifyParking.checkSlot], UserController.parking);
  
  app.get('/api/admin', [authJwt.verifyToken, authJwt.isAdmin], UserController.adminBoard);
  
  app.post('/api/admin/checkIn', [authJwt.verifyToken, authJwt.isAdmin], UserController.checkIn);

  app.post('/api/checkPayment', [authJwt.verifyToken], UserController.checkPayment);
  
  app.get('/api/paymentStatus/:parking_code', [authJwt.verifyToken], UserController.paymentStatus);
  
  app.post('/api/admin/checkOut', [authJwt.verifyToken, authJwt.isAdmin], UserController.checkOut);
  
  app.post('/api/admin/parkingDetail', [authJwt.verifyToken, authJwt.isAdmin], UserController.parkingDetail);

  app.post('/api/checkDistance', [authJwt.verifyToken], UserController.checkDistance);

  // app.get('/api/previewTicket/:parking_code', [authJwt.verifyToken], UserController.previewTicket);
};