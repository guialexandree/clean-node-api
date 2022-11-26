import { SignUpController } from '@/presentation/controllers'
import { MissingParamError, EmailInUseError } from '@/presentation/errors'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers'
import { AddAccountSpy, AuthenticationSpy, ValidationSpy } from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'
import faker from 'faker'

const mockRequest = (): SignUpController.Request => {
  const password = faker.internet.password()
  return {
		name: faker.name.findName(),
		email: faker.internet.email(),
		password,
		passwordConfirmation: password
  }
}

interface SutTypes {
  sut: SignUpController
  addAccountSpy: AddAccountSpy
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const addAccountSpy = new AddAccountSpy()
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new SignUpController(addAccountSpy, validationSpy, authenticationSpy)

  return {
    sut,
    addAccountSpy,
    validationSpy,
    authenticationSpy
  }
}

describe('SignUpController', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const request = mockRequest()

    await sut.handle(request)

    expect(addAccountSpy.addAccountParams).toEqual({
      name: request.name,
      email: request.email,
      password: request.password
    })
  })

  test('Should return status 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut()
		addAccountSpy.result = false

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse)
      .toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return status 500 if AddAccount throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)

		const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
		const request = mockRequest()

    await sut.handle(request)

    expect(authenticationSpy.authenticationParams).toEqual({
      email: request.email,
      password: request.password
    })
  })

  test('Should return status 200 an accessToken', async () => {
    const { sut, authenticationSpy } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok(authenticationSpy.authenticationModel))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()

    await sut.handle(request)

    expect(validationSpy.input).toEqual(request)
  })

  test('Should return status 400 if Validation return error', async () => {
		const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.random.word())

		const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })
})
