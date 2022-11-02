import { z } from 'zod';

export default z.object({
  price: z.number().min(1),
  expiresAt: z.preprocess((arg) => {
    if (typeof arg === 'string' || typeof arg === 'number') {
      return new Date(arg);
    }
    return arg;
  }, z.date().min(new Date(), 'Insert a future date')),
  productId: z.string().uuid(),
});
