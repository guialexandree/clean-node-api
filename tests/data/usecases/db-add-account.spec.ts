import { DbAddAccount } from '@/data/usecases'
import { mockAccountModel, mockAddAccountParams, throwError } from '@/tests/domain/mocks'
import { AddAccountRepositorySpy, HasherSpy, LoadAccountByEmailRepositorySpy } from '@/tests/data/mocks'

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

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest
      .spyOn(hasherSpy, 'hash')
      .mockImplementationOnce(throwError)

    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow()
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

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    jest
			.spyOn(addAccountRepositorySpy, 'add')
			.mockImplementationOnce(throwError)

    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow()
  })

  test('Should return true if loadAccountByEmailRepository returns null', async () => {
    const { sut } = makeSut()

    const isValid = await sut.add(mockAddAccountParams())

    expect(isValid).toBe(true)
  })

	test('Should return false if loadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
		loadAccountByEmailRepositorySpy.accountModel = mockAccountModel()

		const isValid = await sut.add(mockAddAccountParams())

    expect(isValid).toBe(false)
  })
})
