import { SignUpController } from './signup-controller'
import { AddAccount, AddAccountModel, AccountModel, Validation, Authentication, AuthenticationModel, HttpRequest } from './signup-controller-protocols'
import { MissingParamError, InternalServerError, EmailInUseError } from '@/presentation/errors'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null as unknown as Error
    }
  }

  return new ValidationStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
}

const makeAddAccountValidator = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'email@email.com',
    name: 'any_name',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  email: 'email@email.com',
  name: 'valid_name',
  password: 'valid_password'
})

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authentication: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccountValidator()
  const validationStub = makeValidation()
  const authentication = makeAuthentication()
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
    const fakeRequest = makeFakeRequest()

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
    const fakeRequest = makeFakeRequest()

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
    const fakeRequest = makeFakeRequest()

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

    await sut.handle(makeFakeRequest())

    expect(authSpy).toHaveBeenCalledWith({
      email: 'email@email.com',
      password: 'any_password'
    })
  })

  test('Should return status 200 an accessToken', async () => {
    const { sut } = makeSut()
    const fakeRequest = makeFakeRequest()

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse)
      .toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const fakeRequest = makeFakeRequest()

    const validatoSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(fakeRequest)

    expect(validatoSpy).toHaveBeenCalledWith(fakeRequest.body)
  })

  test('Should return status 400 if Validation return error', async () => {
    const { sut, validationStub } = makeSut()
    const fakeRequest = makeFakeRequest()

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_param'))

    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(badRequest(new MissingParamError('any_param')))
  })
})
