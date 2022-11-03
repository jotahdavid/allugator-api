import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import UserRepository from '@repositories/UserRepository';
import Token from '@helpers/Token';

interface Payload extends JwtPayload {
  sub: string;
}

const { ADMIN_KEY } = process.env;

function isValidPayload(payload: any): asserts payload is Payload {
  if (!(typeof payload === 'object' && 'sub' in payload && typeof payload.sub === 'string')) {
    throw new Error('Payload invalid');
  }
}

async function authUserMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token was not provided' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (!/^Bearer$/i.test(scheme) || !token) {
    return res.status(401).json({ error: 'Token malformatted' });
  }

  try {
    const payload = await Token.verify(token);
    isValidPayload(payload);

    const user = await UserRepository.findById(payload.sub);
    if (!user) {
      throw new Error('User doesn\'t exists');
    }

    res.locals.user = user;
  } catch {
    return res.status(401).json({ error: 'Token invalid' });
  }

  return next();
}

function authAdminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!ADMIN_KEY) {
    return res.sendStatus(404);
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token was not provided' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (!/^Bearer$/i.test(scheme) || !token) {
    return res.status(401).json({ error: 'Token malformatted' });
  }

  try {
    if (ADMIN_KEY !== token) {
      throw new Error('Token invalid');
    }
  } catch {
    return res.status(401).json({ error: 'Token invalid' });
  }

  return next();
}

function authMiddleware(role: 'user' | 'admin') {
  return role === 'admin' ? authAdminMiddleware : authUserMiddleware;
}

export default authMiddleware;
