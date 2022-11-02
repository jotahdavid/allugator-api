import { Request, Response } from 'express';

import ProductRepository, { ProductOrderByField } from '@repositories/ProductRepository';
import ProductSchema from '@schemas/ProductSchema';

import formatErrorMessage from '@utils/formatErrorMessage';

const isOrderByField = (value: any): value is ProductOrderByField => {
  const orderFields = Object.values(ProductOrderByField);

  if (Array.isArray(value)) {
    return orderFields.includes(value[0]);
  }

  return orderFields.includes(value);
};

const isString = (value: unknown): value is string => typeof value === 'string';

const getOrderDirection = (value: unknown) => {
  if (isString(value) && (value === 'asc' || value === 'desc')) {
    return value;
  }
  return 'asc';
};

class ProductController {
  async index(req: Request, res: Response) {
    const { orderBy, order } = req.query;

    const orderByField = isOrderByField(orderBy) ? orderBy : ProductOrderByField.NAME;

    const products = await ProductRepository.findAll(
      orderByField,
      getOrderDirection(order),
    );

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
