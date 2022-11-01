import bcrypt from 'bcryptjs';

class Hash {
  make(value: string) {
    return bcrypt.hash(value, 10);
  }

  compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}

export default new Hash();
