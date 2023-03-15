import { rateLimit, RateLimitRequestHandler } from 'express-rate-limit';

export const rateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 1000,
  max: 80,
  message: 'Too many requests from your IP, please try again after 60 seconds',
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message).json({
      status: 'Rate limit error',
      message:
        'Too many requests from your IP, please try again after 60 seconds',
      code: 429,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});