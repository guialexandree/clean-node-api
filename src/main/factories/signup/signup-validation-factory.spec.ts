import { Validation, EmailValidator } from '@/presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { EmailValidation, ValidationComposite, CompareFieldsValidation, RequiredFieldValidation } from '../../../presentation/helpers/validators'

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
