const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
const cryptoService = require('../services/crypto.service');

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
        return res.status(200).json({ token, user, refreshToken: user.refreshToken });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Passwords don\'t match' });
  };

  const login = async (req, res) => {
    const { email, password, refreshToken } = req.body;
    let user;

    if (email) {
      if (password || refreshToken) {
        try {
          user = await User
            .findOne({
              where: {
                email,
              },
            });
          if (!user) {
            return res.status(400).json({ msg: 'Bad Request: User not found' });
          }
        } catch (err) {
          console.log(err);
          return res.status(500).json({ msg: 'Internal server error' });
        }

        if ((password && bcryptService().comparePassword(password, user.password)) ||
          (refreshToken && user.refreshToken === refreshToken)
        ) {
          const token = authService().issue({ id: user.id });
          const newRefreshToken = cryptoService().generateRefreshToken();
          user.refreshToken = newRefreshToken;
          user.save();
          return res.status(200).json({ token, user, refreshToken: newRefreshToken });
        }
      }
    }
    return res.status(401).json({ msg: 'Unauthorized' });
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


  return {
    register,
    login,
    validate,
    getAll,
  };
};

module.exports = UserController;
