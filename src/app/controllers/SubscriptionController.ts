import { Request, Response } from 'express';
import { User } from '@prisma/client';

import SubscriptionRepository from '@repositories/SubscriptionRepository';
import ProductRepository from '@repositories/ProductRepository';
import SubscriptionSchema from '@schemas/SubscriptionSchema';

import formatErrorMessage from '@utils/formatErrorMessage';

type ResponseAuthenticated<TBody = any> = Response<TBody, { user: User }>;

class SubscriptionController {
  async store(req: Request, res: ResponseAuthenticated) {
    const validation = SubscriptionSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(422).json({ error: formatErrorMessage(validation.error) });
    }

    const payload = validation.data;

    const product = await ProductRepository.findById(payload.productId, true);
    if (!product) {
      return res.status(404).json({ error: 'Product not exists' });
    }
    if (product.subscription) {
      return res.status(400).json({ error: 'The product already has an active subscription' });
    }

    const { user } = res.locals;
    const newSubscription = await SubscriptionRepository.create({
      ...payload,
      userId: user.id,
    });

    return res.json({
      id: newSubscription.id,
      price: newSubscription.price,
      expiresAt: newSubscription.expiresAt,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl,
      },
    });
  }
}

export default new SubscriptionController();
