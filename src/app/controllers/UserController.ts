import { Request, Response } from 'express';
import { z } from 'zod';

import UserRepository from '@repositories/UserRepository';

import Hash from '@helpers/Hash';
import formatErrorMessage from '@utils/formatErrorMessage';

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

    const isEmailAlreadyInUse = await UserRepository.findByEmail(validation.data.email);
    if (isEmailAlreadyInUse) {
      return res.status(400).json({ error: 'This e-mail is already in use' });
    }

    const passwordHashed = await Hash.make(validation.data.password);

    const newUser = await UserRepository.create({
      ...validation.data,
      password: passwordHashed,
    });

    return res.status(201).json({ user: newUser });
  }
}

export default new UserController();
