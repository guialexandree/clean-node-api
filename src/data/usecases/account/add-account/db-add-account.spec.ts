import { mockAccountModel, mockAddAccountParams, throwError } from '@/domain/test'
import { mockHasher, mockAddAccountRepository } from '@/data/test'
import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols'
import { Hasher, DbAddAccount, AccountModel, AddAccountRepository } from './db-add-account-protocols'

const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(null as unknown as AccountModel))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
		const addAccountParams = mockAddAccountParams()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.add(addAccountParams)

    expect(loadSpy).toHaveBeenCalledWith(addAccountParams.email)
  })

  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
		const addAccount = mockAddAccountParams()

    await sut.add(addAccount)

    expect(hashSpy).toHaveBeenCalledWith(addAccount.password)
  })

  test('Should throw if Hasher throws', () => {
    const { sut, hasherStub } = makeSut()
    jest
      .spyOn(hasherStub, 'hash')
      .mockImplementationOnce(throwError)

    const promise = sut.add(mockAddAccountParams())

    void expect(promise).rejects.toThrow()
  })

  test('Should AddAccountRepository if correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
		const fakeAccount = mockAddAccountParams()

    await sut.add(fakeAccount)

    expect(addSpy).toHaveBeenCalledWith({
			...fakeAccount,
			password: 'hashed_password'
		})
  })

  test('Should throw if AddAccountRepository throws', () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest
			.spyOn(addAccountRepositoryStub, 'add')
			.mockImplementationOnce(throwError)

    const promise = sut.add(mockAddAccountParams())

    void expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.add(mockAddAccountParams())

    expect(account).toEqual(mockAccountModel())
  })

	test('Should return null if email already in use', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
		jest
			.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
			.mockReturnValueOnce(new Promise(resolve => resolve(mockAccountModel())))

		const account = await sut.add(mockAddAccountParams())

    expect(account).toEqual(null)
  })
})
