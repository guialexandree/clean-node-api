import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/criptography/encrypter'

export class BcryptAdapter implements Encrypter {
	public readonly salt: number

	constructor (salt: number = 12) {
		this.salt = salt
	}

	async encrypt (value: string) : Promise<string> {
		const hash = bcrypt.hash(value, this.salt)
		return hash
	}
}
