import JWT, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY ?? '';

class Token {
  generate(payload: string | object): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      JWT.sign(
        payload,
        SECRET_KEY,
        { algorithm: 'HS256' },
        (err, token) => (err ? reject(err) : resolve(token)),
      );
    });
  }

  verify(token: string): Promise<string | JwtPayload | undefined> {
    return new Promise((resolve, reject) => {
      JWT.verify(
        token,
        SECRET_KEY,
        (err, decoded) => (err ? reject(err) : resolve(decoded)),
      );
    });
  }
}

export default new Token();
