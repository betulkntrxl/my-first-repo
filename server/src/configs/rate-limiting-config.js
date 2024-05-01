import { rateLimit } from 'express-rate-limit';

const getRateLimitConfigForKnownRoutes = () => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  });
  return limiter;
};

const getRateLimitConfigForUnKnownRoutes = () => {
  const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 10, // Limit each IP to 10 requests per `window`.
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  });
  return limiter;
};
export { getRateLimitConfigForKnownRoutes, getRateLimitConfigForUnKnownRoutes };
