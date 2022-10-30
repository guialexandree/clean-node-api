
import { mockAccessTokenRepository, mockEncrypter, mockHashComparer, mockLoadAccountByEmailRepository } from '@/data/test'
import { mockAuthentication, mockAccountModel, throwError } from '@/domain/test'
import { DbAuthentication } from './db-authentication'
import {
  Authentication,
  AccountModel,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  HashComparer,
  Encrypter
} from './db-authentication-protocols'

interface SutTypes {
  sut: Authentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hashComparerStub = mockHashComparer()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockAccessTokenRepository()

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
		const authentication = mockAuthentication()

    await sut.auth(authentication)

    expect(loadSpy).toHaveBeenCalledWith(authentication.email)
  })

  test('Should throws if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(throwError)

    const promise = sut.auth(mockAuthentication())

    void expect(promise).rejects.toThrow()
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

    await sut.auth(mockAuthentication())

    expect(compareSpy).toHaveBeenCalledWith(mockAuthentication().password, mockAccountModel().password)
  })

  test('Should throws if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockImplementationOnce(throwError)

    const promise = sut.auth(mockAuthentication())

    void expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer return false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise(resolve => resolve(false)))

    const accessToken = await sut.auth(mockAuthentication())

    expect(accessToken).toBeNull()
  })

  test('Should return an token if Encrypter on success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(mockAuthentication())

    expect(accessToken).toBe('any_token')
  })

  test('Should throws if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockImplementationOnce(throwError)

    const promise = sut.auth(mockAuthentication())

    void expect(promise).rejects.toThrow()
  })

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.auth(mockAuthentication())

    expect(encryptSpy).toBeCalledWith(mockAccountModel().id)
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const encryptSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')

    const acessToken = await sut.auth(mockAuthentication())

    expect(encryptSpy).toBeCalledWith(mockAccountModel().id, acessToken)
  })

  test('Should throws if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockImplementationOnce(throwError)

    const promise = sut.auth(mockAuthentication())

    void expect(promise).rejects.toThrow()
  })
})
