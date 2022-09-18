import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-accound-by-email-repository'

export class DbAuthentication implements Authentication {
	private readonly loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
	private readonly hashComparerStub: HashComparer
	private readonly tokenGeneratorStub: TokenGenerator

	constructor (
		loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
		hashComparerStub: HashComparer,
		tokenGeneratorStub: TokenGenerator
	) {
		this.loadAccountByEmailRepositoryStub = loadAccountByEmailRepositoryStub
		this.hashComparerStub = hashComparerStub
		this.tokenGeneratorStub = tokenGeneratorStub
	}

	async auth (authentication: AuthenticationModel) : Promise<string> {
		const account = await this.loadAccountByEmailRepositoryStub.load(authentication.email)
		if (account) {
			const isValid = await this.hashComparerStub.compare(authentication.password, account.password)
			if (isValid) {
				const accessToken = await this.tokenGeneratorStub.generate(account.id)
			}
		}

		return null as unknown as string
	}
}
