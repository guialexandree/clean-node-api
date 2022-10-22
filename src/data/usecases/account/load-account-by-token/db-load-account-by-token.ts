import {
	AccountModel,
	LoadAccountByToken,
	Decrypter,
	LoadAccountByTokenRepository
} from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
	constructor (
		private readonly decrypterStub: Decrypter,
		private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
	) {}

	async load (accessToken: string, role?: string): Promise<AccountModel> {
		const token = await this.decrypterStub.decrypt(accessToken)
		if (token) {
			const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
			if (account) {
				return account
			}
		}
		return null
	}
}
