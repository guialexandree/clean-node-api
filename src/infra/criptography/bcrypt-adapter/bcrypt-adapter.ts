import bcrypt from 'bcrypt'
import { HashComparer } from '../../../data/protocols/criptography/hash-comparer'
import { Hasher } from '../../../data/protocols/criptography/hasher'

export class BcryptAdapter implements Hasher, HashComparer {
	constructor (public readonly salt: number = 12) {}

	async hash (value: string) : Promise<string> {
		const hash = bcrypt.hash(value, this.salt)
		return hash
	}

	async compare (value: string, hashed: string) : Promise<boolean> {
		const isValid = await bcrypt.compare(value, hashed)
		return isValid
	}
}