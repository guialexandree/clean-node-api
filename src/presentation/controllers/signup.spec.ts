import { SignUpController } from './signup'
import { EmailValidator } from '../protocols'
import { MissingParamError, InvalidParamError, InternalServerError } from '../errors'

interface SutTypes {
	sut: SignUpController,
	emailValidatorStub: EmailValidator
}

const makeSut = () : SutTypes => {
	class EmailValidatorStub implements EmailValidator {
		isValid (email: string) : boolean {
			return true
		}
	}
	const emailValidatorStub = new EmailValidatorStub()
	const sut = new SignUpController(emailValidatorStub)

	return {
		sut,
		emailValidatorStub
	}
}

describe('SignUp Controller', () => {
	test('Should return status 400 if no name is provided', () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'email@email.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}

		const httpResponse = sut.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('name'))
	})

	test('Should return status 400 if no email is provided', () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}

		const httpResponse = sut.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('email'))
	})

	test('Should return status 400 if no password is provided', () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'email@email.com',
				name: 'any_name',
				passwordConfirmation: 'any_password'
			}
		}

		const httpResponse = sut.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('password'))
	})

	test('Should return status 400 if no passwordConfirmation is provided', () => {
		const { sut } = makeSut()
		const httpRequest = {
			body: {
				email: 'email@email.com',
				name: 'any_name',
				password: 'any_password'
			}
		}

		const httpResponse = sut.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
	})

	test('Should return status 400 if an invalid email is provided', () => {
		const { sut, emailValidatorStub } = makeSut()
		const httpRequest = {
			body: {
				email: 'invalid@email.com',
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}

		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
		const httpResponse = sut.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new InvalidParamError('email'))
	})

	test('Should call EmailValidator with corret email', () => {
		const { sut, emailValidatorStub } = makeSut()
		const httpRequest = {
			body: {
				email: 'email@email.com',
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}

		const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
		sut.handle(httpRequest)

		expect(isValidSpy).toHaveBeenCalledWith('email@email.com')
	})

	test('Should return status 500 if EmailValidator throws', () => {
		class EmailValidatorStub implements EmailValidator {
			isValid (email: string) : boolean {
				throw new Error()
			}
		}

		const emailValidatorStub = new EmailValidatorStub()
		const sut = new SignUpController(emailValidatorStub)
		const httpRequest = {
			body: {
				email: 'invalid@email.com',
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}

		const httpResponse = sut.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(500)
		expect(httpResponse.body).toEqual(new InternalServerError())
	})
})
