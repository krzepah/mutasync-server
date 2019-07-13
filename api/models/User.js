const Sequelize = require('sequelize');
const bcryptService = require('../services/bcrypt.service');
const cryptoService = require('../services/crypto.service');
const sequelize = require('../../config/database');

const hooks = {
  beforeCreate(user) {
    user.password = bcryptService().password(user); // eslint-disable-line no-param-reassign
  },
};

const tableName = 'users';

const User = sequelize.define('User', {
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
  },
  refreshToken: {
    type: Sequelize.STRING,
    defaultValue: () => cryptoService().generateRefreshToken(),
  },
}, { hooks, tableName });

// eslint-disable-next-line
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  delete values.password;
  delete values.refreshToken;

  return values;
};

module.exports = User;
