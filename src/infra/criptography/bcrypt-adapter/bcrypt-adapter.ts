import bcrypt from 'bcrypt'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { Hasher } from '@/data/protocols/criptography/hasher'

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
