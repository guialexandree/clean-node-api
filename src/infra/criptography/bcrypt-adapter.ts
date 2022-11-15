import bcrypt from 'bcrypt'
import { HashComparer, Hasher } from '@/data/protocols/'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (public readonly salt: number = 12) {}

  async hash (plaintext: string): Promise<string> {
    const digest = bcrypt.hash(plaintext, this.salt)
    return await digest
  }

  async compare (plaintext: string, digest: string): Promise<boolean> {
    const isValid = await bcrypt.compare(plaintext, digest)
    return isValid
  }
}
