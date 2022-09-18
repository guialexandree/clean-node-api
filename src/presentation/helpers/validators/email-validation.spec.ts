import { Validation } from './validation'
import { EmailValidator } from '../../protocols/email-validator'
import { InvalidParamError } from '../../errors'
import { EmailValidation } from './email-validation'

const makeValidation = () : Validation => {
	class ValidationStub implements Validation {
		validate (input: any) : Error {
			return null as unknown as Error
		}
	}

	return new ValidationStub()
}

export const makeEmailValidator = () : EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid (email: string) : boolean {
			return true
		}
	}

	return new EmailValidatorStub()
}

interface SutTypes {
	sut: EmailValidation,
	emailValidatorStub: EmailValidator,
	validationStub: Validation
}

const makeSut = () : SutTypes => {
	const emailValidatorStub = makeEmailValidator()
	const validationStub = makeValidation()
	const sut = new EmailValidation('email', emailValidatorStub)

	return {
		sut,
		emailValidatorStub,
		validationStub
	}
}

describe('SignUp Controller', () => {
	test('Should return an erro if EmailValidator returns false', () => {
		const { sut, emailValidatorStub } = makeSut()

		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

		const erro = sut.validate({ email: 'guilherme@email.com' })

		expect(erro).toEqual(new InvalidParamError('email'))
	})

	test('Should call EmailValidator with corret email', () => {
		const { sut, emailValidatorStub } = makeSut()
		const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

		sut.validate({ email: 'guilherme@email.com' })

		expect(isValidSpy).toHaveBeenCalledWith('guilherme@email.com')
	})

	test('Should throw if EmailValidator throws', () => {
		const { sut, emailValidatorStub } = makeSut()
		jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
			throw new Error()
		})

		expect(sut.validate).toThrow()
	})
})
