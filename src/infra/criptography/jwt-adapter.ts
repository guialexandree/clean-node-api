import jwt from 'jsonwebtoken'
import { type Encrypter, type Decrypter } from '@/data/protocols/'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (plaintext: string): Promise<string> {
    const ciphertext = jwt.sign({ id: plaintext }, this.secret)
    return ciphertext
  }

	async decrypt (ciphertext: string): Promise<string> {
		const plaintext: any = jwt.verify(ciphertext, this.secret)
		return plaintext
	}
}
