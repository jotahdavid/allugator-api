import { Request, Response } from 'express';

import ProductRepository from '@repositories/ProductRepository';
import ProductSchema from '@schemas/ProductSchema';

import formatErrorMessage from '@utils/formatErrorMessage';

class ProductController {
  async index(req: Request, res: Response) {
    const products = await ProductRepository.findAll();

    return res.json(products);
  }

  async store(req: Request, res: Response) {
    const validation = ProductSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(422).json({
        error: formatErrorMessage(validation.error),
      });
    }

    const newProduct = await ProductRepository.create({
      ...validation.data,
      description: validation.data.description ?? null,
    });

    return res.status(201).json(newProduct);
  }
}

export default new ProductController();
