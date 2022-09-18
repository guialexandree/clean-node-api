import { SignInController } from './signin'
import { MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { Authentication } from '../../../domain/usecases/authentication'
import { Validation } from './signin-protocols'

interface SutTypes {
	sut: SignInController
	validationStub: Validation
	authentication: Authentication
}

const makeAuthentication = () : Authentication => {
	class AuthenticationStub implements Authentication {
		async auth (email: string, password: string) : Promise<string> {
			return new Promise(resolve => resolve('any_token'))
		}
	}

	return new AuthenticationStub()
}

const makeValidation = () : Validation => {
	class ValidationStub implements Validation {
		validate (input: any) : Error {
			return null as unknown as Error
		}
	}

	return new ValidationStub()
}

const makeFakeRequest = () => ({
	body: {
		email: 'email@email.com',
		password: 'any_password'
	}
})

const makeSut = () : SutTypes => {
	const authentication = makeAuthentication()
	const validationStub = makeValidation()
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

		await sut.handle(makeFakeRequest())

		expect(authSpy).toHaveBeenCalledWith('email@email.com', 'any_password')
	})

	test('Should return 401 if invalid credentials are provided', async () => {
		const { sut, authentication } = makeSut()
		jest
			.spyOn(authentication, 'auth')
			.mockReturnValueOnce(new Promise((resolve) => resolve(null as any)))

		const accessToken = await sut.handle(makeFakeRequest())

		expect(accessToken).toEqual(unauthorized())
	})

	test('Should return 500 if Authentication throws', async () => {
		const { sut, authentication } = makeSut()
		jest
			.spyOn(authentication, 'auth')
			.mockImplementationOnce(() => { throw new Error() })

		const result = await sut.handle(makeFakeRequest())

		expect(result).toEqual(serverError(new Error()))
	})

	test('Should return 200 and an accessToken valid if Authentication on success', async () => {
		const { sut } = makeSut()

		const result = await sut.handle(makeFakeRequest())

		expect(result).toEqual(ok({ accessToken: 'any_token' }))
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
