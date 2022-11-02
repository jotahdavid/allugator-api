import { Request, Response } from 'express';
import { User } from '@prisma/client';

import UserSchema from '@schemas/UserSchema';
import UserRepository from '@repositories/UserRepository';

import Hash from '@helpers/Hash';
import formatErrorMessage from '@utils/formatErrorMessage';

type ResponseAuthenticated<TBody = any> = Response<TBody, { user: User }>;

class UserController {
  async store(req: Request, res: Response) {
    const validation = UserSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(422).json({
        error: formatErrorMessage(validation.error),
      });
    }

    const payload = validation.data;

    const isEmailAlreadyInUse = await UserRepository.findByEmail(payload.email);
    if (isEmailAlreadyInUse) {
      return res.status(400).json({ error: 'This e-mail is already in use' });
    }

    const passwordHashed = await Hash.make(payload.password);

    const newUser = await UserRepository.create({
      ...payload,
      password: passwordHashed,
    });

    return res.status(201).json({ user: newUser });
  }

  async getByToken(req: Request, res: ResponseAuthenticated) {
    const { user } = res.locals;

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return res.json({ user: userResponse });
  }
}

export default new UserController();
