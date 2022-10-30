import { SignInController } from './signin-controller'
import { Validation, Authentication, HttpRequest } from './signin-controller-protocols'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { MissingParamError } from '@/presentation/errors'
import { mockAuthentication, mockValidation } from '@/presentation/test'

const mockRequest = (): HttpRequest => ({
  body: {
    email: 'email@email.com',
    password: 'any_password'
  }
})

interface SutTypes {
  sut: SignInController
  validationStub: Validation
  authentication: Authentication
}

const makeSut = (): SutTypes => {
  const authentication = mockAuthentication()
  const validationStub = mockValidation()
  const sut = new SignInController(authentication, validationStub)

  return {
    sut,
    validationStub,
    authentication
  }
}

describe('SignIn Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authentication } = makeSut()
    const authSpy = jest.spyOn(authentication, 'auth')

    await sut.handle(mockRequest())

    expect(authSpy).toHaveBeenCalledWith({
      email: 'email@email.com',
      password: 'any_password'
    })
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authentication } = makeSut()
    jest
      .spyOn(authentication, 'auth')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null as any)))

    const accessToken = await sut.handle(mockRequest())

    expect(accessToken).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authentication } = makeSut()
    jest
      .spyOn(authentication, 'auth')
      .mockImplementationOnce(() => { throw new Error() })

    const result = await sut.handle(mockRequest())

    expect(result).toEqual(serverError(new Error()))
  })

  test('Should return 200 and an accessToken valid if Authentication on success', async () => {
    const { sut } = makeSut()

    const result = await sut.handle(mockRequest())

    expect(result).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const fakeRequest = mockRequest()

    const validatoSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(fakeRequest)

    expect(validatoSpy).toHaveBeenCalledWith(fakeRequest.body)
  })

  test('Should return status 400 if Validation return error', async () => {
    const { sut, validationStub } = makeSut()
    const fakeRequest = mockRequest()

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_param'))

    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(badRequest(new MissingParamError('any_param')))
  })
})
