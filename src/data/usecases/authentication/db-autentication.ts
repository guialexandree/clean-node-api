import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-accound-by-email-repository'

export class DbAuthentication implements Authentication {
	private readonly loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository

	constructor (loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository) {
		this.loadAccountByEmailRepositoryStub = loadAccountByEmailRepositoryStub
	}

	async auth (authentication: AuthenticationModel) : Promise<string> {
		this.loadAccountByEmailRepositoryStub.load(authentication.email)
		return new Promise(resolve => resolve(null as unknown as string))
	}
}
