import { Request, Response } from 'express';
import { User } from '@prisma/client';

import SubscriptionRepository from '@repositories/SubscriptionRepository';
import ProductRepository from '@repositories/ProductRepository';
import SubscriptionSchema from '@schemas/SubscriptionSchema';

import formatErrorMessage from '@utils/formatErrorMessage';

type ResponseAuthenticated<TBody = any> = Response<TBody, { user: User }>;

function getDateOneYearLater() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date;
}

class SubscriptionController {
  async store(req: Request, res: ResponseAuthenticated) {
    const validation = SubscriptionSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(422).json({ error: formatErrorMessage(validation.error) });
    }

    const payload = validation.data;

    const product = await ProductRepository.findById(payload.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not exists' });
    }

    const { user } = res.locals;

    const newSubscription = await SubscriptionRepository.create({
      price: product.rentPrice,
      productId: payload.productId,
      userId: user.id,
      expiresAt: getDateOneYearLater(),
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

  async getAllUserSubscriptions(req: Request, res: ResponseAuthenticated) {
    const { user } = res.locals;

    const subscriptions = await SubscriptionRepository.findAllByUserId(user.id);

    const parsedSubscriptions = subscriptions.map((subscription) => {
      const product = !subscription.product ? null : {
        ...subscription.product,
        createdAt: undefined,
      };

      return {
        id: subscription.id,
        price: subscription.price,
        expiresAt: subscription.expiresAt,
        product,
      };
    });

    return res.json(parsedSubscriptions);
  }
}

export default new SubscriptionController();
