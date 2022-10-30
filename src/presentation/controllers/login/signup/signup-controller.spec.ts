import { SignUpController } from './signup-controller'
import { AddAccount, AccountModel, Validation, Authentication, HttpRequest } from './signup-controller-protocols'
import { MissingParamError, InternalServerError, EmailInUseError } from '@/presentation/errors'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { mockAddAccountValidator, mockAuthentication, mockValidation } from '@/presentation/test'

const mockRequest = (): HttpRequest => ({
  body: {
    email: 'email@email.com',
    name: 'any_name',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authentication: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccountValidator()
  const validationStub = mockValidation()
  const authentication = mockAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authentication)

  return {
    sut,
    addAccountStub,
    validationStub,
    authentication
  }
}

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const fakeRequest = mockRequest()

    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(fakeRequest)

    expect(addSpy).toHaveBeenCalledWith({
      email: 'email@email.com',
      name: 'any_name',
      password: 'any_password'
    })
  })

  test('Should return status 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    const fakeRequest = mockRequest()

    jest
      .spyOn(addAccountStub, 'add')
      .mockImplementationOnce(async () => {
        return await new Promise((resolve) => resolve(null as unknown as AccountModel))
      })
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse)
      .toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return status 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    const fakeRequest = mockRequest()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse)
      .toEqual(serverError(new InternalServerError(httpResponse.body)))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authentication } = makeSut()
    const authSpy = jest.spyOn(authentication, 'auth')

    await sut.handle(mockRequest())

    expect(authSpy).toHaveBeenCalledWith({
      email: 'email@email.com',
      password: 'any_password'
    })
  })

  test('Should return status 200 an accessToken', async () => {
    const { sut } = makeSut()
    const fakeRequest = mockRequest()

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse)
      .toEqual(ok({ accessToken: 'any_token' }))
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
