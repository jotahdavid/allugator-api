import { Request, Response } from 'express';

import UserSchema from '@schemas/UserSchema';
import UserRepository from '@repositories/UserRepository';

import Hash from '@helpers/Hash';
import formatErrorMessage from '@utils/formatErrorMessage';

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
}

export default new UserController();
