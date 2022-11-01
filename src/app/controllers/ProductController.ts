import { Request, Response } from 'express';

import prisma from '../../services/prisma';

class ProductController {
  async index(req: Request, res: Response) {
    const products = await prisma.product.findMany();

    return res.json(products);
  }
}

export default new ProductController();
