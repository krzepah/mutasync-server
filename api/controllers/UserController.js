/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "mutations" }] */

const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
const { mutations } = require('../../custom/mutations');
const { map } = require('ramda');

const UserController = () => {
  const register = async (req, res) => {
    const { body } = req;

    if (body.password === body.password2) {
      try {
        const user = await User.create({
          email: body.email,
          password: body.password,
        });
        const token = authService().issue({ id: user.id });

        return res.status(200).json({ token, user });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Passwords don\'t match' });
  };

  const login = async (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
      try {
        const user = await User
          .findOne({
            where: {
              email,
            },
          });

        if (!user) {
          return res.status(400).json({ msg: 'Bad Request: User not found' });
        }

        if (bcryptService().comparePassword(password, user.password)) {
          const token = authService().issue({ id: user.id });
          const userData = JSON.parse(user.data);
          return res.status(200).json({ token, user, ...userData });
        }

        return res.status(401).json({ msg: 'Unauthorized' });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Email or password is wrong' });
  };

  const validate = (req, res) => {
    const { token } = req.body;

    authService().verify(token, (err) => {
      if (err) {
        return res.status(401).json({ isvalid: false, err: 'Invalid Token!' });
      }

      return res.status(200).json({ isvalid: true });
    });
  };

  const getAll = async (req, res) => {
    try {
      const users = await User.findAll();

      return res.status(200).json({ users });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const getState = async (req, res) => {
    const { id } = req.token;
    const user = await User.findOne({ where: { ...id } });
    return res.status(200).json({ ...JSON.parse(user.data) });
  };

  const bulkApply = async (req, res) => {
    const { assign } = Object;
    const { id } = req.token;
    const user = await User.findOne({ where: { ...id } });
    const { acts } = req.body;
    let state = JSON.parse(user.data);

    map((act) => {
      const key = Object.keys(act)[0];
      const update = mutations[key](state, act[key]);
      state = assign(assign({}, state), update);
    }, acts);

    user.data = JSON.stringify(state);
    user.save();
    return res.status(200).json({ msg: 'Ok !' });
  };

  return {
    register,
    login,
    validate,
    getAll,
    getState,
    bulkApply,
  };
};

module.exports = UserController;
