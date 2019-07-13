const crypto = require('crypto');

const cryptoService = () => {
  const generateRefreshToken = () => crypto.randomBytes(20).toString('hex');

  return {
    generateRefreshToken,
  };
};

module.exports = cryptoService;
