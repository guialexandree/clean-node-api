import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { AccountModel } from '@/domain/models/account'
import { Decrypter } from '@/data/protocols/criptography/decrypter'

export class DbLoadAccountByToken implements LoadAccountByToken {
	constructor (private readonly decrypterStub: Decrypter) {}

	async load (accessToken: string, role?: string): Promise<AccountModel> {
		await this.decrypterStub.decrypt(accessToken)
		return null
	}
}
