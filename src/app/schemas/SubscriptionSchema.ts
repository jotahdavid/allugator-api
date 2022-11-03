import { z } from 'zod';

export default z.object({
  productId: z.string().uuid(),
});
