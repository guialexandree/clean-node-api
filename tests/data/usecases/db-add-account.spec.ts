import { DbAddAccount } from '@/data/usecases'
import { mockAddAccountParams, throwError } from '@/tests/domain/mocks'
import { AddAccountRepositorySpy, CheckAccountByEmailRepositorySpy, HasherSpy } from '@/tests/data/mocks'

interface SutTypes {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkAccountByEmailRepositorySpy = new CheckAccountByEmailRepositorySpy()
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, checkAccountByEmailRepositorySpy)

	return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    checkAccountByEmailRepositorySpy
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
		const addAccountParams = mockAddAccountParams()

    await sut.add(addAccountParams)

    expect(checkAccountByEmailRepositorySpy.email).toBe(addAccountParams.email)
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

  test('Should calls AddAccountRepository if correct values', async () => {
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

  test('Should return true on success', async () => {
    const { sut } = makeSut()

    const isValid = await sut.add(mockAddAccountParams())

    expect(isValid).toBe(true)
  })

	test('Should return false if addAccountRepository returns false', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
		addAccountRepositorySpy.result = false

		const isValid = await sut.add(mockAddAccountParams())

    expect(isValid).toBe(false)
  })

	test('Should return false if loadAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
		checkAccountByEmailRepositorySpy.result = true

		const isValid = await sut.add(mockAddAccountParams())

    expect(isValid).toBe(false)
  })

	test('Should call loadAccountByEmailRepository wwith correct email', async () => {
    const { sut, checkAccountByEmailRepositorySpy: loadAccountByEmailRepositorySpy } = makeSut()
		const addAccountParams = mockAddAccountParams()

		await sut.add(addAccountParams)

    expect(loadAccountByEmailRepositorySpy.email).toBe(addAccountParams.email)
  })
})
