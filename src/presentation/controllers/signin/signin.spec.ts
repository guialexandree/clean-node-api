import { SignInController } from './signin'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
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
		const fakeRequest = {
			body: {
				email: 'email@email.com',
				password: 'any_password'
			}
		}
		const isValidSpy = jest.spyOn(emailValidator, 'isValid')

		await sut.handle(fakeRequest)

		expect(isValidSpy).toHaveBeenCalledWith('email@email.com')
	})
})
