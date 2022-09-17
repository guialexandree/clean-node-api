import { RequiredFieldValidation } from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'

export const makeSignInValidation = () : ValidationComposite => {
	const validations: Validation[] = []
	for (const field of ['email', 'password']) {
		validations.push(new RequiredFieldValidation(field))
	}

	return new ValidationComposite(validations)
}
