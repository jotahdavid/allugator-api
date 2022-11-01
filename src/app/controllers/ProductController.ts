import { Request, Response } from 'express';
import z from 'zod';
import { fromZodError } from 'zod-validation-error';

import prisma from '../../services/prisma';

const storeSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(1),
  imageUrl: z.string().url(),
  description: z.string().optional(),
});

class ProductController {
  async index(req: Request, res: Response) {
    const products = await prisma.product.findMany();

    return res.json(products);
  }

  async store(req: Request, res: Response) {
    const validation = storeSchema.safeParse(req.body);

    if (!validation.success) {
      const validationError = fromZodError(validation.error, { maxIssuesInMessage: 2 });
      return res.status(422).json({ error: validationError.message });
    }

    const newProduct = await prisma.product.create({
      data: validation.data,
    });

    return res.status(201).json(newProduct);
  }
}

export default new ProductController();
