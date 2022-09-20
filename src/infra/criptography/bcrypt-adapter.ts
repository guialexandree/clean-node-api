import bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/criptography/hasher'

export class BcryptAdapter implements Hasher {
	public readonly salt: number

	constructor (salt: number = 12) {
		this.salt = salt
	}

	async hash (value: string) : Promise<string> {
		const hash = bcrypt.hash(value, this.salt)
		return hash
	}
}
