import { Request, Response } from 'express';
import { validate as validateUUID } from 'uuid';

import ProductRepository, { ProductOrderByField } from '@repositories/ProductRepository';
import ProductSchema from '@schemas/ProductSchema';

import formatErrorMessage from '@utils/formatErrorMessage';

const isOrderByField = (value: any): value is ProductOrderByField => {
  const orderFields = Object.values(ProductOrderByField);

  return orderFields.includes(value);
};

const getFirstValue = <T>(value: T | T[]) => (
  Array.isArray(value) ? value[0] : value
);

const getOrderDirection = (value: unknown): 'asc' | 'desc' => (
  (value === 'asc' || value === 'desc') ? value : 'asc'
);

class ProductController {
  async index(req: Request, res: Response) {
    const { query } = req;

    const orderBy = getFirstValue(query.orderBy);
    const orderByField = isOrderByField(orderBy) ? orderBy : ProductOrderByField.NAME;

    const order = getFirstValue(query.order);

    const products = await ProductRepository.findAll(
      orderByField,
      getOrderDirection(order),
    );

    return res.json(products);
  }

  async show(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!validateUUID(id)) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = await ProductRepository.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({
      ...product,
      createdAt: undefined,
    });
  }

  async store(req: Request, res: Response) {
    const validation = ProductSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(422).json({
        error: formatErrorMessage(validation.error),
      });
    }

    const payload = validation.data;

    const newProduct = await ProductRepository.create({
      ...payload,
      description: payload.description ?? null,
    });

    return res.status(201).json(newProduct);
  }
}

export default new ProductController();
