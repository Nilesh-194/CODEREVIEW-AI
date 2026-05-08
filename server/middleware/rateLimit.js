import rateLimit, { ipKeyGenerator } from 'express-rate-limit'

export const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many reviews. Limit: 10 per hour.' },
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
})

export const aiAskLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
})
