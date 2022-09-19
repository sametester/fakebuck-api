const { request } = require('express');

module.exports = (req, res, next) => {
  res.statusCode(404).json({ message: 'resource not found on this server' });
};
