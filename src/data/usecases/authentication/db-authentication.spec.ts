
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

const makeFakeAuthentication = () => ({
	email: 'guilherme@email.com',
	password: 'any_passord'
})

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

		await sut.auth(makeFakeAuthentication())

		expect(loadSpy).toHaveBeenCalledWith('guilherme@email.com')
	})

	test('Should throws if LoadAccountByEmailRepository throws', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut()
		jest
			.spyOn(loadAccountByEmailRepositoryStub, 'load')
			.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

		const promise = sut.auth(makeFakeAuthentication())

		expect(promise).rejects.toThrow()
	})

	test('Should return null if LoadAccountByEmailRepository returns null', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut()
		jest
			.spyOn(loadAccountByEmailRepositoryStub, 'load')
			.mockReturnValueOnce(new Promise((resolve) => resolve(null as unknown as AccountModel)))

		const account = await sut.auth({
			email: 'guilherme@email.com',
			password: 'any_passord'
		})

		expect(account).toBeNull()
	})

	test('Should return an account if LoadAccountByEmailRepository return account', async () => {
		const { sut } = makeSut()

		const account = await sut.auth({
			email: 'guilherme@email.com',
			password: 'any_passord'
		})

		// expect(account).toEqual()
	})
})
