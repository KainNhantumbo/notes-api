import Logger from '../utils/logger';
import { rateLimit } from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: 'Too many requests from your IP, please try again after 60 seconds.',
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (req, res, next, options) {
    const event = new Logger({
      message: `${options.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      fileName: 'rate-limiter.log'
    });
    event.register();
  }
});
