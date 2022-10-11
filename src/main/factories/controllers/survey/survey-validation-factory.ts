import { Validation } from '@/presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

export const makeSurveyValidation = () : ValidationComposite => {
	const validations: Validation[] = []
	for (const field of ['answers', 'question']) {
		validations.push(new RequiredFieldValidation(field))
	}

	return new ValidationComposite(validations)
}
