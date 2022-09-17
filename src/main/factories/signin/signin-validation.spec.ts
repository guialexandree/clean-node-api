import { RequiredFieldValidation } from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
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
		// const emailValidator = makeEmailValidator()
		for (const field of ['email', 'password']) {
			validations.push(new RequiredFieldValidation(field))
		}

		expect(ValidationComposite).toHaveBeenCalledWith(validations)
	})
})
