import { Validation } from '../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../presentation/helpers/validators'

export const makeSignInValidation = () : ValidationComposite => {
	const validations: Validation[] = []
	for (const field of ['email', 'password']) {
		validations.push(new RequiredFieldValidation(field))
	}
	validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

	return new ValidationComposite(validations)
}
