const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const bcrypt = require('bcryptjs');

const {
  ApplicationController,
  AuthenticationController,
  CarController,
} = require('./controllers');

const {
  User,
  Role,
  Car,
  UserCar,
} = require('./models');

function apply(app) {
  const carModel = Car;
  const roleModel = Role;
  const userModel = User;
  const userCarModel = UserCar;

  const applicationController = new ApplicationController();
  const authEnt = new AuthenticationController({ bcrypt, jwt, roleModel, userModel });
  const carController = new CarController({ carModel, userCarModel, dayjs });

  const accessControler = authEnt.accessControl;

  app.get('/', applicationController.handleGetRoot);

  app.get('/v1/cars', carController.handleListCars);
  app.post('/v1/cars', authEnt.authorize(accessControler.ADMIN), carController.handleCreateCar);
  app.post('/v1/cars/:id/rent', authEnt.authorize(accessControler.CUSTOMER), carController.handleRentCar);
  app.get('/v1/cars/:id', carController.handleGetCar);
  app.put('/v1/cars/:id', authEnt.authorize(accessControler.ADMIN), carController.handleUpdateCar);
  app.delete('/v1/cars/:id', authEnt.authorize(accessControler.ADMIN), carController.handleDeleteCar);

  app.post('/v1/auth/login', authEnt.handleLogin);
  app.post('/v1/auth/register', authEnt.handleRegister);
  app.get('/v1/auth/whoami', authEnt.authorize(accessControler.CUSTOMER), authEnt.handleGetUser);

  app.use(applicationController.handleNotFound);
  app.use(applicationController.handleError);

  return app;
}

module.exports = { apply };
