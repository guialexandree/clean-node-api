import { SignInController } from './signin'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { EmailValidator } from '../../../presentation/protocols/email-validator'

interface SutTypes {
	sut: SignInController
	emailValidator: EmailValidator
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
	const sut = new SignInController(emailValidator)

	return {
		sut,
		emailValidator
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

	test('Should return 500 if EmailValidator thorws', async () => {
		const { sut, emailValidator } = makeSut()
		jest
			.spyOn(emailValidator, 'isValid')
			.mockImplementationOnce(() => { throw new Error() })

		const result = await sut.handle(makeFakeRequest())

		expect(result).toEqual(serverError(new Error()))
	})
})
