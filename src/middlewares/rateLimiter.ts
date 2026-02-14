import rateLimit from "express-rate-limit";



export const ensureRateLimiter = (time: number, max: number = 5) => rateLimit({
  windowMs: time * 60 * 1000, 
  max: max,
  message: {
    message: `Muitas tentativas. Tente novamente em ${time} minutos.`
  }

});
