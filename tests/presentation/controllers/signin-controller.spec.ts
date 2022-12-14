import { SignInController } from '@/presentation/controllers'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers'
import { MissingParamError } from '@/presentation/errors'
import { AuthenticationSpy, ValidationSpy } from '@/tests/presentation/mocks'
import faker from 'faker'

const mockRequest = (): SignInController.Request => ({
  email: faker.internet.email(),
	password: faker.internet.password()
})

interface SutTypes {
  sut: SignInController
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const validationSpy = new ValidationSpy()
  const sut = new SignInController(authenticationSpy, validationSpy)

  return {
    sut,
    validationSpy,
    authenticationSpy
  }
}

describe('SignInController', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
		const request = mockRequest()

    await sut.handle(request)

    expect(authenticationSpy.authenticationParams).toEqual({
      email: request.email,
      password: request.password
    })
	})

  test('Should return 401 if invalid credentials are provided', async () => {
		const { sut, authenticationSpy } = makeSut()
    authenticationSpy.authenticationModel = null

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest
      .spyOn(authenticationSpy, 'auth')
      .mockImplementationOnce(() => { throw new Error() })

    const result = await sut.handle(mockRequest())

    expect(result).toEqual(serverError(new Error()))
  })

  test('Should return 200 and an accessToken valid if Authentication on success', async () => {
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
