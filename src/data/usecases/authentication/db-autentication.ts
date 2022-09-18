import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-accound-by-email-repository'

export class DbAuthentication implements Authentication {
	private readonly loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
	private readonly hashComparerStub: HashComparer

	constructor (
		loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
		hashComparerStub: HashComparer
	) {
		this.loadAccountByEmailRepositoryStub = loadAccountByEmailRepositoryStub
		this.hashComparerStub = hashComparerStub
	}

	async auth (authentication: AuthenticationModel) : Promise<string> {
		const account = await this.loadAccountByEmailRepositoryStub.load(authentication.email)
		if (account) {
			await this.hashComparerStub.compare(authentication.password, account.password)
		}

		return null as unknown as string
	}
}
