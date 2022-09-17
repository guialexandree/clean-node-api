import { Validation } from '../../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { CompareFieldsValidation, RequiredFieldValidation } from '../../../presentation/helpers/validators'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeSignUpValidation = () : ValidationComposite => {
	const validations: Validation[] = []
	for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
		validations.push(new RequiredFieldValidation(field))
	}
	validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
	validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
	return new ValidationComposite(validations)
}
