import { z } from 'zod';

export default z.object({
  name: z.string().min(1),
  price: z.number().min(1),
  imageUrl: z.string().url(),
  description: z.string().min(1).optional(),
});
