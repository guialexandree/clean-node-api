
import { Authentication } from '../../../domain/usecases/authentication'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-accound-by-email-repository'
import { DbAuthentication } from './db-autentication'

const makeLoadAccountByEmailRepository = () : LoadAccountByEmailRepository => {
	class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
		async load (email: string) : Promise<AccountModel> {
			const account: AccountModel = {
				id: 'any_id',
				name: 'guilherme',
				email: 'guilherme@email.com',
				password: 'any_password'
			}
			return new Promise(resolve => resolve(account))
		}
	}
	return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
	sut: Authentication,
	loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = () : SutTypes => {
	const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
	const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)

	return {
		sut,
		loadAccountByEmailRepositoryStub
	}
}

describe('Db Authentication', () => {
	test('Should call LoadAccountByEmailRepository with correct email', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut()
		const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

		await sut.auth({
			email: 'guilherme@email.com',
			password: 'any_passord'
		})

		expect(loadSpy).toHaveBeenCalledWith('guilherme@email.com')
	})
})
