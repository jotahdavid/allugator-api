import { Request, Response } from 'express';

import LoginSchema from '@schemas/LoginSchema';

import formatErrorMessage from '@utils/formatErrorMessage';
import UserRepository from '@repositories/UserRepository';
import Hash from '@helpers/Hash';

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

    return res.json({ user: userResponse });
  }
}

export default new AuthController();
