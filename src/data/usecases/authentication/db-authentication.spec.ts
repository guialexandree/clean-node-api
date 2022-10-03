
import { DbAuthentication } from './db-authentication'
import {
	Authentication,
	AccountModel,
	LoadAccountByEmailRepository,
	UpdateAccessTokenRepository,
	HashComparer,
	Encrypter
 } from './db-authentication-protocols'

const makeLoadAccountByEmailRepository = () : LoadAccountByEmailRepository => {
	class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
		async loadByEmail (email: string) : Promise<AccountModel> {
			const account: AccountModel = makeFakeAccount()
			return new Promise(resolve => resolve(account))
		}
	}
	return new LoadAccountByEmailRepositoryStub()
}

const makeAccessTokenRepository = () : UpdateAccessTokenRepository => {
	class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
		async updateAccessToken (id: string, accessToken: string) : Promise<void> {
			return new Promise(resolve => resolve())
		}
	}
	return new UpdateAccessTokenRepositoryStub()
}

const makeHashComparer = () : HashComparer => {
	class HashComparerStub implements HashComparer {
		async compare (value: string, hashed: string) : Promise<boolean> {
			return new Promise(resolve => resolve(true))
		}
	}
	return new HashComparerStub()
}

const makeEncrypter = () : Encrypter => {
	class EncrypterStub implements Encrypter {
		async encrypt (id: string) : Promise<string> {
			return new Promise(resolve => resolve('any_token'))
		}
	}
	return new EncrypterStub()
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

type SutTypes = {
	sut: Authentication,
	loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
	hashComparerStub: HashComparer,
	encrypterStub: Encrypter,
	updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = () : SutTypes => {
	const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
	const hashComparerStub = makeHashComparer()
	const encrypterStub = makeEncrypter()
	const updateAccessTokenRepositoryStub = makeAccessTokenRepository()

	const sut = new DbAuthentication(
		loadAccountByEmailRepositoryStub,
		hashComparerStub,
		encrypterStub,
		updateAccessTokenRepositoryStub
		)

	return {
		sut,
		loadAccountByEmailRepositoryStub,
		hashComparerStub,
		encrypterStub,
		updateAccessTokenRepositoryStub
	}
}

describe('Db Authentication', () => {
	test('Should call LoadAccountByEmailRepository with correct email', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut()
		const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

		await sut.auth(makeFakeAuthentication())

		expect(loadSpy).toHaveBeenCalledWith('guilherme@email.com')
	})

	test('Should throws if LoadAccountByEmailRepository throws', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut()
		jest
			.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
			.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

		const promise = sut.auth(makeFakeAuthentication())

		expect(promise).rejects.toThrow()
	})

	test('Should return null if LoadAccountByEmailRepository returns null', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut()
		jest
			.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
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

	test('Should return null if HashComparer return false', async () => {
		const { sut, hashComparerStub } = makeSut()
		jest
			.spyOn(hashComparerStub, 'compare')
			.mockReturnValueOnce(new Promise(resolve => resolve(false)))

		const accessToken = await sut.auth(makeFakeAuthentication())

		expect(accessToken).toBeNull()
	})

	test('Should return an token if Encrypter on success', async () => {
		const { sut } = makeSut()
		const accessToken = await sut.auth(makeFakeAuthentication())

		expect(accessToken).toBe('any_token')
	})

	test('Should throws if Encrypter throws', async () => {
		const { sut, encrypterStub } = makeSut()
		jest
			.spyOn(encrypterStub, 'encrypt')
			.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

		const promise = sut.auth(makeFakeAuthentication())

		expect(promise).rejects.toThrow()
	})

	test('Should call Encrypter with correct id', async () => {
		const { sut, encrypterStub } = makeSut()
		const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

		await sut.auth(makeFakeAuthentication())

		expect(encryptSpy).toBeCalledWith(makeFakeAccount().id)
	})

	test('Should call UpdateAccessTokenRepository with correct values', async () => {
		const { sut, updateAccessTokenRepositoryStub } = makeSut()
		const encryptSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')

		const acessToken = await sut.auth(makeFakeAuthentication())

		expect(encryptSpy).toBeCalledWith(makeFakeAccount().id, acessToken)
	})

	test('Should throws if UpdateAccessTokenRepository throws', async () => {
		const { sut, updateAccessTokenRepositoryStub } = makeSut()
		jest
			.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
			.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

		const promise = sut.auth(makeFakeAuthentication())

		expect(promise).rejects.toThrow()
	})
})
