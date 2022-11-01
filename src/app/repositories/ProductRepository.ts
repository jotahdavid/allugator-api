import { Product } from '@prisma/client';

import prisma from '@services/prisma';

type NewProduct = Omit<Product, 'id' | 'createdAt'>;

class ProductRepository {
  findAll() {
    return prisma.product.findMany();
  }

  create(newProduct: NewProduct) {
    return prisma.product.create({
      data: newProduct,
    });
  }
}

export default new ProductRepository();
