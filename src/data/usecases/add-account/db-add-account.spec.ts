import { Encrypter, DbAddAccount, AccountModel, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'

const makeEncrypter = () : Encrypter => {
	class EncrypterStub implements Encrypter {
		async encrypt (value: string) : Promise<string> {
			return new Promise(resolve => resolve('hashed_password'))
		}
	}

	return new EncrypterStub()
}

const makeFakeAccount = () => ({
	id: 'valid_id',
	name: 'valid_name',
	email: 'valid_email',
	password: 'hashed_password'
})

const makeAddAccountRepository = () : AddAccountRepository => {
	class AddAccountRepositoryStub implements AddAccountRepository {
		async add (accountData: AddAccountModel) : Promise<AccountModel> {
			return new Promise(resolve => resolve(makeFakeAccount()))
		}
	}

	return new AddAccountRepositoryStub()
}

const makeFakeAddAccount = () : AddAccountModel => ({
	name: 'valid_name',
	email: 'valid_email',
	password: 'valid_password'
})

interface SutTypes {
	sut: DbAddAccount,
	encrypterStub: Encrypter,
	addAccountRepository: AddAccountRepository
}

const makeSut = () : SutTypes => {
	const encrypterStub = makeEncrypter()
	const addAccountRepository = makeAddAccountRepository()
	const sut = new DbAddAccount(encrypterStub, addAccountRepository)

	return {
		sut,
		encrypterStub,
		addAccountRepository
	}
}

describe('DbAddAccount Usecase', () => {
	test('Should call Encrypter with correct password', async () => {
		const { sut, encrypterStub } = makeSut()
		const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

		await sut.add(makeFakeAddAccount())

		expect(encryptSpy).toHaveBeenCalledWith('valid_password')
	})

	test('Should throw if Encrypter throws', () => {
		const { sut, encrypterStub } = makeSut()
		jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

		const promise = sut.add(makeFakeAddAccount())

		expect(promise).rejects.toThrow()
	})

	test('Should AddAccountRepository if correct values', async () => {
		const { sut, addAccountRepository } = makeSut()
		const addSpy = jest.spyOn(addAccountRepository, 'add')

		await sut.add(makeFakeAddAccount())

		expect(addSpy).toHaveBeenCalledWith({
			name: 'valid_name',
			email: 'valid_email',
			password: 'hashed_password'
		})
	})

	test('Should throw if AddAccountRepository throws', () => {
		const { sut, addAccountRepository } = makeSut()
		jest.spyOn(addAccountRepository, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

		const promise = sut.add(makeFakeAddAccount())

		expect(promise).rejects.toThrow()
	})

	test('Should return an account on success', async () => {
		const { sut } = makeSut()

		const account = await sut.add(makeFakeAddAccount())

		expect(account).toEqual(makeFakeAccount())
	})
})
