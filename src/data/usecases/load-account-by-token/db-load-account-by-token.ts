import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { AccountModel } from '@/domain/models/account'
import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
	constructor (
		private readonly decrypterStub: Decrypter,
		private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
		) {}

	async load (accessToken: string, role?: string): Promise<AccountModel> {
		const token = await this.decrypterStub.decrypt(accessToken)
		if (token) {
			await this.loadAccountByTokenRepository.load(accessToken)
		}
		return null
	}
}
