import { SignInController } from './signin'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { Authentication } from '../../../domain/usecases/authentication'
import { UnauthorizedError } from '../../errors/unauthorized-error'

interface SutTypes {
	sut: SignInController
	emailValidator: EmailValidator
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

const makeEmailValidator = () : EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid (email: string) : boolean {
			return true
		}
	}

	return new EmailValidatorStub()
}

const makeFakeRequest = () => ({
	body: {
		email: 'email@email.com',
		password: 'any_password'
	}
})

const makeSut = () : SutTypes => {
	const emailValidator = makeEmailValidator()
	const authentication = makeAuthentication()
	const sut = new SignInController(emailValidator, authentication)

	return {
		sut,
		emailValidator,
		authentication
	}
}

describe('SignIn Controller', () => {
	test('Should return 400 if no email is provied', async () => {
		const { sut } = makeSut()
		const fakeRequest = {
			body: { password: 'any_password' }
		}

		const result = await sut.handle(fakeRequest)

		expect(result).toEqual(badRequest(new MissingParamError('email')))
	})

	test('Should return 400 if no password is provied', async () => {
		const { sut } = makeSut()
		const fakeRequest = {
			body: { email: 'email@email.com' }
		}

		const result = await sut.handle(fakeRequest)

		expect(result).toEqual(badRequest(new MissingParamError('password')))
	})

	test('Should call EmailValidation with call correct email', async () => {
		const { sut, emailValidator } = makeSut()

		const isValidSpy = jest.spyOn(emailValidator, 'isValid')

		await sut.handle(makeFakeRequest())

		expect(isValidSpy).toHaveBeenCalledWith('email@email.com')
	})

	test('Should return 400 if an invalid email is provided', async () => {
		const { sut, emailValidator } = makeSut()
		jest
			.spyOn(emailValidator, 'isValid')
			.mockReturnValueOnce(false)

		const result = await sut.handle(makeFakeRequest())

		expect(result).toEqual(badRequest(new InvalidParamError('email')))
	})

	test('Should return 500 if EmailValidator throws', async () => {
		const { sut, emailValidator } = makeSut()
		jest
			.spyOn(emailValidator, 'isValid')
			.mockImplementationOnce(() => { throw new Error() })

		const result = await sut.handle(makeFakeRequest())

		expect(result).toEqual(serverError(new Error()))
	})

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
})
