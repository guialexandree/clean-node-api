import { Validation, EmailValidator } from '../../../presentation/protocols'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { makeSignInValidation } from './signin-validation'

jest.mock('../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = () : EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid (email: string) : boolean {
			return true
		}
	}

	return new EmailValidatorStub()
}

describe('SignInValidation Factory', () => {
	test('Should call ValidationComposite with all validations', () => {
		makeSignInValidation()
		const validations: Validation[] = []

		for (const field of ['email', 'password']) {
			validations.push(new RequiredFieldValidation(field))
		}
		validations.push(new EmailValidation('email', makeEmailValidator()))

		expect(ValidationComposite).toHaveBeenCalledWith(validations)
	})
})
