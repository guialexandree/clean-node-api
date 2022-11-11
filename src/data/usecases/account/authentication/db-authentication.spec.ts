
import { DbAuthentication } from './db-authentication'
import { Authentication } from './db-authentication-protocols'
import { mockAuthenticationParams, throwError } from '@/domain/test'
import { UpdateAccessTokenRepositorySpy, EncrypterSpy, HashComparerSpy, LoadAccountByEmailRepositorySpy } from '@/data/test'

interface SutTypes {
  sut: Authentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  hashComparerSpy: HashComparerSpy
  encrypterSpy: EncrypterSpy
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  )

  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  }
}

describe('Db Authentication', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
		const authentication = mockAuthenticationParams()

    await sut.auth(authentication)

    expect(loadAccountByEmailRepositorySpy.email).toBe(authentication.email)
  })

  test('Should throws if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
      .mockImplementationOnce(throwError)

    const promise = sut.auth(mockAuthenticationParams())

    void expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
		loadAccountByEmailRepositorySpy.accountModel = null

    const account = await sut.auth(mockAuthenticationParams())

    expect(account).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy, loadAccountByEmailRepositorySpy } = makeSut()
		const authenticationParams = mockAuthenticationParams()

    await sut.auth(authenticationParams)

    expect(hashComparerSpy.plaintext).toBe(authenticationParams.password)
    expect(hashComparerSpy.digest).toBe(loadAccountByEmailRepositorySpy.accountModel.password)
  })

  test('Should throws if HashComparer throws', async () => {
    const { sut, hashComparerSpy: hashComparerStub } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockImplementationOnce(throwError)

    const promise = sut.auth(mockAuthenticationParams())

    void expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer return false', async () => {
    const { sut, hashComparerSpy } = makeSut()
		hashComparerSpy.isValid = false

    const accessToken = await sut.auth(mockAuthenticationParams())

    expect(accessToken).toBeNull()
  })

  test('Should return an token if Encrypter on success', async () => {
    const { sut, encrypterSpy } = makeSut()
    const accessToken = await sut.auth(mockAuthenticationParams())

    expect(accessToken).toBe(encrypterSpy.ciphertext)
  })

  test('Should call Encrypter with correct plaintext', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()

    await sut.auth(mockAuthenticationParams())

    expect(encrypterSpy.plaintext).toBe(loadAccountByEmailRepositorySpy.accountModel.id)
  })

	test('Should throws if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    jest
      .spyOn(encrypterSpy, 'encrypt')
      .mockImplementationOnce(throwError)

    const promise = sut.auth(mockAuthenticationParams())

    void expect(promise).rejects.toThrow()
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositorySpy, loadAccountByEmailRepositorySpy, encrypterSpy } = makeSut()

    await sut.auth(mockAuthenticationParams())

    expect(updateAccessTokenRepositorySpy.id).toBe(loadAccountByEmailRepositorySpy.accountModel.id)
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.ciphertext)
  })

  test('Should throws if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()
    jest
      .spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken')
      .mockImplementationOnce(throwError)

    const promise = sut.auth(mockAuthenticationParams())

    void expect(promise).rejects.toThrow()
  })
})
