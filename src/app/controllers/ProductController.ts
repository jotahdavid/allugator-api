import { Request, Response } from 'express';
import z from 'zod';

import prisma from '@services/prisma';
import formatErrorMessage from '@utils/formatErrorMessage';

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
      return res.status(422).json({
        error: formatErrorMessage(validation.error),
      });
    }

    const newProduct = await prisma.product.create({
      data: validation.data,
    });

    return res.status(201).json(newProduct);
  }
}

export default new ProductController();
