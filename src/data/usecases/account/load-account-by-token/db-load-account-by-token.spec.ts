import {
	AccountModel,
	Decrypter,
	LoadAccountByTokenRepository,
	DbLoadAccountByToken
} from './db-load-account-by-token-protocols'

const makeDecrypter = (): Decrypter => {
	class DecrypterStub implements Decrypter {
		async decrypt (value: string): Promise<string> {
			return await new Promise(resolve => resolve('decrypted_value'))
		}
	}

	return new DecrypterStub()
}

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
	class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
		async loadByToken (accessToken: string, role?: string): Promise<AccountModel> {
			return await new Promise(resolve => resolve(makeFakeAccount()))
		}
	}

	return new LoadAccountByTokenRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'guilherme',
  email: 'guilherme99@email.com',
  password: 'hashed_password'
})

type SutTypes = {
	sut: DbLoadAccountByToken
	decrypterStub: Decrypter
	loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
	const decrypterStub = makeDecrypter()
	const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
	const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
	return {
		sut,
		decrypterStub,
		loadAccountByTokenRepositoryStub
	}
}

describe('DbLoadAccountByToken UseCase', () => {
	test('Should calls Decrypter with correct value', async () => {
		const { sut, decrypterStub } = makeSut()
		const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

		await sut.load('any_token', 'any_role')

		expect(decryptSpy).toHaveBeenCalledWith('any_token')
	})

	test('Should return null if Decrypter returns null', async () => {
		const { sut, decrypterStub } = makeSut()
		jest
			.spyOn(decrypterStub, 'decrypt')
			.mockReturnValueOnce(new Promise(resolve => resolve(null)))

		const account = await sut.load('any_token', 'any_role')

		expect(account).toBeNull()
	})

	test('Should calls LoadAccountByTokenRepository with correct values', async () => {
		const { sut, loadAccountByTokenRepositoryStub } = makeSut()
		const loadSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')

		await sut.load('any_token', 'any_role')

		expect(loadSpy).toHaveBeenCalledWith('any_token', 'any_role')
	})

	test('Should return null if LoadAccountByTokenRepository returns null', async () => {
		const { sut, loadAccountByTokenRepositoryStub } = makeSut()
		jest
			.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
			.mockReturnValueOnce(new Promise(resolve => resolve(null)))

		const account = await sut.load('any_token', 'any_role')

		expect(account).toBeNull()
	})

	test('Should return an account on success', async () => {
		const { sut } = makeSut()

		const account = await sut.load('any_token', 'any_role')

		expect(account).toEqual(makeFakeAccount())
	})

	test('Should throw if LoadAccountByTokenRepository throws', () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.load('any_token', 'any_role')

    void expect(promise).rejects.toThrow()
  })

	test('Should throw if Decrypter throws', () => {
    const { sut, decrypterStub } = makeSut()
    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.load('any_token', 'any_role')

    void expect(promise).rejects.toThrow()
  })
})
