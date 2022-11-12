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
