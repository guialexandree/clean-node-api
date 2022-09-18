import { RequiredFieldValidation } from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
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
