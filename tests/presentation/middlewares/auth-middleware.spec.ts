
import { AuthMiddleware } from '@/presentation/middlewares'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { AccessDeniedError } from '@/presentation/errors'
import { throwError } from '@/tests/domain/mocks'
import { LoadAccountByTokenSpy } from '@/tests/presentation/mocks'

const mockRequest = (): AuthMiddleware.Request => {
  return {
		accessToken: 'any_token'
  }
}

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenSpy: LoadAccountByTokenSpy
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy()
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role)

  return {
    sut,
    loadAccountByTokenSpy
  }
}

describe('AuthMiddleware', () => {
	test('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenSpy } = makeSut(role)
    const request = mockRequest()

    await sut.handle(request)

    expect(loadAccountByTokenSpy.accessToken).toBe(request.accessToken)
    expect(loadAccountByTokenSpy.role).toBe(role)
  })

	test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
		loadAccountByTokenSpy.accountModel = null

    const response = await sut.handle({})

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

	test('Should return status 200 if LoadAccountByToken returns an account', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok({
      accountId: loadAccountByTokenSpy.accountModel.id
    }))
	})

  test('Should return status 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    jest
      .spyOn(loadAccountByTokenSpy, 'load')
      .mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
