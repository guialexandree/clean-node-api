import { CompareFieldsValidation, RequiredFieldValidation } from '../../../presentation/helpers/validators'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { Validation } from '../../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = () : EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid (email: string) : boolean {
			return true
		}
	}

	return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
	test('Should call ValidationComposite with all validations', () => {
		makeSignUpValidation()
		const validations: Validation[] = []
		const emailValidator = makeEmailValidator()
		for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
			validations.push(new RequiredFieldValidation(field))
		}
		validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
		validations.push(new EmailValidation('email', emailValidator))
		expect(ValidationComposite).toHaveBeenCalledWith(validations)
	})
})
