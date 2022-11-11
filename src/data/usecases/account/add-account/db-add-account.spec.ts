import { mockAccountModel, mockAddAccountParams, throwError } from '@/domain/test'
import { AddAccountRepositorySpy, HasherSpy, LoadAccountByEmailRepositorySpy } from '@/data/test'
import { DbAddAccount } from './db-add-account-protocols'

interface SutTypes {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  loadAccountByEmailRepositorySpy.accountModel = null
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, loadAccountByEmailRepositorySpy)

	return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
		const addAccountParams = mockAddAccountParams()

    await sut.add(addAccountParams)

    expect(loadAccountByEmailRepositorySpy.email).toBe(addAccountParams.email)
  })

  test('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut()
		const addAccount = mockAddAccountParams()

    await sut.add(addAccount)

    expect(hasherSpy.plaintext).toBe(addAccount.password)
  })

  test('Should throw if Hasher throws', () => {
    const { sut, hasherSpy } = makeSut()
    jest
      .spyOn(hasherSpy, 'hash')
      .mockImplementationOnce(throwError)

    const promise = sut.add(mockAddAccountParams())

    void expect(promise).rejects.toThrow()
  })

  test('Should AddAccountRepository if correct values', async () => {
    const { sut, addAccountRepositorySpy, hasherSpy } = makeSut()
    const addAccountParams = mockAddAccountParams()

    await sut.add(addAccountParams)

    expect(addAccountRepositorySpy.addAccountParams).toEqual({
      name: addAccountParams.name,
      email: addAccountParams.email,
      password: hasherSpy.digest
    })
  })

  test('Should throw if AddAccountRepository throws', () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    jest
			.spyOn(addAccountRepositorySpy, 'add')
			.mockImplementationOnce(throwError)

    const promise = sut.add(mockAddAccountParams())

    void expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()

    const account = await sut.add(mockAddAccountParams())

    expect(account).toEqual(addAccountRepositorySpy.accountModel)
  })

	test('Should return null if email already in use', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
		loadAccountByEmailRepositorySpy.accountModel = mockAccountModel()

		const account = await sut.add(mockAddAccountParams())

    expect(account).toEqual(null)
  })
})
