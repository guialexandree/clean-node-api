
import { Authentication } from '../../../domain/usecases/authentication'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-accound-by-email-repository'
import { DbAuthentication } from './db-autentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'

const makeLoadAccountByEmailRepository = () : LoadAccountByEmailRepository => {
	class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
		async load (email: string) : Promise<AccountModel> {
			const account: AccountModel = makeFakeAccount()
			return new Promise(resolve => resolve(account))
		}
	}
	return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = () : HashComparer => {
	class HashComparerStub implements HashComparer {
		async compare (value: string, hashed: string) : Promise<boolean> {
			return new Promise(resolve => resolve(true))
		}
	}
	return new HashComparerStub()
}

const makeFakeAuthentication = () => ({
	email: 'guilherme@email.com',
	password: 'any_passord'
})

const makeFakeAccount = () => ({
	id: 'any_id',
	name: 'guilherme',
	email: 'guilherme@email.com',
	password: 'hashed_password'
})

interface SutTypes {
	sut: Authentication,
	loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
	hashComparerStub: HashComparer
}

const makeSut = () : SutTypes => {
	const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
	const hashComparerStub = makeHashComparer()
	const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub)

	return {
		sut,
		loadAccountByEmailRepositoryStub,
		hashComparerStub
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

	test('Should call HashComparer with correct values', async () => {
		const { sut, hashComparerStub } = makeSut()
		const compareSpy = jest.spyOn(hashComparerStub, 'compare')

		await sut.auth(makeFakeAuthentication())

		expect(compareSpy).toHaveBeenCalledWith(makeFakeAuthentication().password, makeFakeAccount().password)
	})

	test('Should throws if HashComparer throws', async () => {
		const { sut, hashComparerStub } = makeSut()
		jest
			.spyOn(hashComparerStub, 'compare')
			.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

		const promise = sut.auth(makeFakeAuthentication())

		expect(promise).rejects.toThrow()
	})
})
