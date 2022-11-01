import { Request, Response } from 'express';
import { z } from 'zod';

import Hash from '../../helpers/Hash';
import prisma from '../../services/prisma';
import formatErrorMessage from '../../utils/formatErrorMessage';

const storeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(4),
});

class UserController {
  async store(req: Request, res: Response) {
    const validation = storeSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(422).json({
        error: formatErrorMessage(validation.error),
      });
    }

    const { data } = validation;

    const isEmailAlreadyInUse = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (isEmailAlreadyInUse) {
      return res.status(400).json({ error: 'This e-mail is already in use' });
    }

    const passwordHashed = await Hash.make(data.password);

    const newUser = await prisma.user.create({
      data: {
        ...data,
        password: passwordHashed,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return res.status(201).json({ user: newUser });
  }
}

export default new UserController();
