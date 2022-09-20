import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { Encrypter } from '../../protocols/criptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-accound-by-email-repository'

export class DbAuthentication implements Authentication {
	private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
	private readonly hashComparer: HashComparer
	private readonly tokenGenerator: Encrypter

	constructor (
		loadAccountByEmailRepository: LoadAccountByEmailRepository,
		hashComparer: HashComparer,
		tokenGenerator: Encrypter
	) {
		this.loadAccountByEmailRepository = loadAccountByEmailRepository
		this.hashComparer = hashComparer
		this.tokenGenerator = tokenGenerator
	}

	async auth (authentication: AuthenticationModel) : Promise<string> {
		const account = await this.loadAccountByEmailRepository.load(authentication.email)
		if (account) {
			const isValid = await this.hashComparer.compare(authentication.password, account.password)
			if (isValid) {
				const accessToken = await this.tokenGenerator.encrypt(account.id)
				return accessToken
			}
		}

		return null as unknown as string
	}
}
