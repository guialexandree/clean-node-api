
import { LoadAccountByToken, HttpRequest, AuthMiddleware } from './auth-middleware-protocols'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors/access-denied-error'
import { throwError } from '@/domain/test'
import { mockLoadAccountByToken } from '@/presentation/test'

const mockRequest = (): HttpRequest => {
  return {
    headers: {
      'x-access-token': 'any_token'
    }
  }
}

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)

  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exist in header', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({})

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct values', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

    await sut.handle(mockRequest())

    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()

    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle({})

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return status 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(mockRequest())

    expect(response).toEqual(ok({ accountId: 'any_id' }))
  })

  test('Should return status 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()

    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockImplementationOnce(throwError)
    const response = await sut.handle(mockRequest())

    expect(response).toEqual(serverError(new Error()))
  })
})
