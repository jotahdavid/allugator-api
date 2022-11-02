import { Subscription } from '@prisma/client';

import prisma from '@services/prisma';

type NewSubscription = Omit<Subscription, 'id'>;

class SubscriptionRepository {
  create(newSubscription: NewSubscription) {
    return prisma.subscription.create({
      data: newSubscription,
    });
  }
}

export default new SubscriptionRepository();
