import { AccountModel } from '@/domain/models'
import { LoadAccountByToken } from '@/domain/usecases'
import { Decrypter, LoadAccountByTokenRepository } from '@/data/protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
	constructor (
		private readonly decrypterStub: Decrypter,
		private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
	) {}

	async load (accessToken: string, role?: string): Promise<AccountModel> {
		let token: string
		try {
			token = await this.decrypterStub.decrypt(accessToken)
		} catch (error) {
			return null
		}
		if (token) {
			const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
			if (account) {
				return account
			}
		}
		return null
	}
}
