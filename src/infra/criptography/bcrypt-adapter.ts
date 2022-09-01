import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/encrypter'

export class BcryptAdapater implements Encrypter {
	public readonly salt: number

	constructor (salt: number = 12) {
		this.salt = salt
	}

	async encrypt (value: string) : Promise<string> {
		const hash = bcrypt.hash(value, this.salt)
		return new Promise((resolve) => resolve(hash))
	}
}
