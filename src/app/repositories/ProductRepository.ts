import { Product } from '@prisma/client';

import prisma from '@services/prisma';

export enum ProductOrderByField {
  NAME = 'name',
  PRICE = 'price',
}

type NewProduct = Omit<Product, 'id' | 'createdAt'>;

class ProductRepository {
  findById(id: string, includeSubscriptions: boolean = false) {
    return prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        subscriptions: includeSubscriptions,
      },
    });
  }

  findAll(orderByField: ProductOrderByField, order: 'asc' | 'desc') {
    return prisma.product.findMany({
      orderBy: {
        [orderByField]: order,
      },
    });
  }

  create(newProduct: NewProduct) {
    return prisma.product.create({
      data: newProduct,
    });
  }
}

export default new ProductRepository();
