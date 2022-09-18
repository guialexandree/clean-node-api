import { EmailValidation, RequiredFieldValidation } from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeSignInValidation = () : ValidationComposite => {
	const validations: Validation[] = []
	for (const field of ['email', 'password']) {
		validations.push(new RequiredFieldValidation(field))
	}
	validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

	return new ValidationComposite(validations)
}
