const rateLimit = require('express-rate-limit');

const rateLimitingMiddleware = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes.'
});

module.exports = rateLimitingMiddleware;
