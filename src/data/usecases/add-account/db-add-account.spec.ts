import { Encrypter, DbAddAccount, AccountModel, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'

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

const makeEncrypter = () : Encrypter => {
	class EncrypterStub implements Encrypter {
		async encrypt (value: string) : Promise<string> {
			return new Promise(resolve => resolve('hashed_password'))
		}
	}

	return new EncrypterStub()
}

const makeAddAccountRepository = () : AddAccountRepository => {
	class AddAccountRepositoryStub implements AddAccountRepository {
		async add (accountData: AddAccountModel) : Promise<AccountModel> {
			const fakeAccount = {
				id: 'valid_id',
				name: 'valid_name',
				email: 'valid_email',
				password: 'hashed_password'
			}

			return new Promise(resolve => resolve(fakeAccount))
		}
	}

	return new AddAccountRepositoryStub()
}

describe('DbAddAccount Usecase', () => {
	test('Should call Encrypter with correct password', async () => {
		const { sut, encrypterStub } = makeSut()
		const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password'
		}
		await sut.add(accountData)
		expect(encryptSpy).toHaveBeenCalledWith('valid_password')
	})

	test('Should throw if Encrypter throws', () => {
		const { sut, encrypterStub } = makeSut()
		jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password'
		}

		const promise = sut.add(accountData)

		expect(promise).rejects.toThrow()
	})

	test('Should AddAccountRepository if correct values', async () => {
		const { sut, addAccountRepository } = makeSut()
		const addSpy = jest.spyOn(addAccountRepository, 'add')
		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password'
		}

		await sut.add(accountData)

		expect(addSpy).toHaveBeenCalledWith({
			name: 'valid_name',
			email: 'valid_email',
			password: 'hashed_password'
		})
	})

	test('Should throw if AddAccountRepository throws', () => {
		const { sut, addAccountRepository } = makeSut()
		jest.spyOn(addAccountRepository, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password'
		}

		const promise = sut.add(accountData)

		expect(promise).rejects.toThrow()
	})
})
