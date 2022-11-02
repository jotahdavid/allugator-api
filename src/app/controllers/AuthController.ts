import { Request, Response } from 'express';

import LoginSchema from '@schemas/LoginSchema';

import UserRepository from '@repositories/UserRepository';

import Hash from '@helpers/Hash';
import Token from '@helpers/Token';
import formatErrorMessage from '@utils/formatErrorMessage';

const HOUR_IN_SECONDS = 3600;

class AuthController {
  async login(req: Request, res: Response) {
    const validation = LoginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(422).json({
        error: formatErrorMessage(validation.error),
      });
    }

    const user = await UserRepository.findByEmail(validation.data.email);
    if (!user) {
      return res.status(400).json({ error: 'E-mail or password are invalid' });
    }

    const isTheSamePassword = await Hash.compare(validation.data.password, user.password);
    if (!isTheSamePassword) {
      return res.status(400).json({ error: 'E-mail or password are invalid' });
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = await Token.generate({
      iss: 'allugator-api',
      sub: user.id,
      exp: Math.floor(Date.now() / 1000) + HOUR_IN_SECONDS,
    });

    return res.json({ user: userResponse, token });
  }
}

export default new AuthController();
