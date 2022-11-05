import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { validate as validateUUID } from 'uuid';

import UserRepository from '@repositories/UserRepository';
import Token from '@helpers/Token';

interface Payload extends JwtPayload {
  sub: string;
}

const { ADMIN_KEY } = process.env;

class TokenError extends Error {}

function getAuthHeaderToken(req: Request) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new TokenError('Token was not provided');
  }

  const [scheme, token] = authHeader.split(' ');

  if (!/^Bearer$/i.test(scheme) || !token) {
    throw new TokenError('Token malformatted');
  }

  return token;
}

function isValidPayload(payload: any): asserts payload is Payload {
  if (
    !(typeof payload === 'object'
      && 'sub' in payload
      && typeof payload.sub === 'string'
      && validateUUID(payload.sub))
  ) {
    throw new Error('Payload invalid');
  }
}

async function authUserMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getAuthHeaderToken(req);

    const payload = await Token.verify(token);
    isValidPayload(payload);

    const user = await UserRepository.findById(payload.sub);
    if (!user) {
      throw new TokenError('Token invalid');
    }

    res.locals.user = user;
  } catch (err) {
    const errorMessage = err instanceof TokenError ? err.message : 'Token invalid';
    return res.status(401).json({ error: errorMessage });
  }

  return next();
}

function authAdminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!ADMIN_KEY) {
    return res.sendStatus(404);
  }

  try {
    const token = getAuthHeaderToken(req);

    if (ADMIN_KEY !== token) {
      throw new TokenError('Token invalid');
    }
  } catch (err) {
    const errorMessage = err instanceof TokenError ? err.message : 'Token invalid';
    return res.status(401).json({ error: errorMessage });
  }

  return next();
}

function authMiddleware(role: 'user' | 'admin') {
  return role === 'admin' ? authAdminMiddleware : authUserMiddleware;
}

export default authMiddleware;
