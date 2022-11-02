import { User } from '@prisma/client';

import prisma from '@services/prisma';

type NewUser = Omit<User, 'id' | 'createdAt'>;

class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  create(newUser: NewUser) {
    return prisma.user.create({
      data: newUser,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}

export default new UserRepository();
