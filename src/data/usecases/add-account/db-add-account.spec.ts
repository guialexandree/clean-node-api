import { Hasher, DbAddAccount, AccountModel, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'

const makeHasher = () : Hasher => {
	class HasherStub implements Hasher {
		async hash (value: string) : Promise<string> {
			return new Promise(resolve => resolve('hashed_password'))
		}
	}

	return new HasherStub()
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

type SutTypes = {
	sut: DbAddAccount,
	hasherStub: Hasher,
	addAccountRepositoryStub: AddAccountRepository
}

const makeSut = () : SutTypes => {
	const hasherStub = makeHasher()
	const addAccountRepositoryStub = makeAddAccountRepository()
	const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)

	return {
		sut,
		hasherStub,
		addAccountRepositoryStub
	}
}

describe('DbAddAccount Usecase', () => {
	test('Should call Hasher with correct password', async () => {
		const { sut, hasherStub } = makeSut()
		const hashSpy = jest.spyOn(hasherStub, 'hash')

		await sut.add(makeFakeAddAccount())

		expect(hashSpy).toHaveBeenCalledWith('valid_password')
	})

	test('Should throw if Hasher throws', () => {
		const { sut, hasherStub } = makeSut()
		jest
			.spyOn(hasherStub, 'hash')
			.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

		const promise = sut.add(makeFakeAddAccount())

		expect(promise).rejects.toThrow()
	})

	test('Should AddAccountRepository if correct values', async () => {
		const { sut, addAccountRepositoryStub: addAccountRepository } = makeSut()
		const addSpy = jest.spyOn(addAccountRepository, 'add')

		await sut.add(makeFakeAddAccount())

		expect(addSpy).toHaveBeenCalledWith({
			name: 'valid_name',
			email: 'valid_email',
			password: 'hashed_password'
		})
	})

	test('Should throw if AddAccountRepository throws', () => {
		const { sut, addAccountRepositoryStub: addAccountRepository } = makeSut()
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
