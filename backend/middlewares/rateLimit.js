import rateLimit from "express-rate-limit";

export const guestLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Free guest limit reached (3 requests/day). Please sign in."
  }
});

export const userLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user.id,
  message: {
    error:
      "Free user limit reached (15 requests/day). Please wait for reset or upgrade."
  }
});

export const recipeLimiter = (req, res, next) => {
  if (req.user) {
    return userLimiter(req, res, next);
  }

  return guestLimiter(req, res, next);
};

// Separate limiter for meal plans
export const mealPlanLimiter = recipeLimiter;

export const smartRecipeLimiter = recipeLimiter;