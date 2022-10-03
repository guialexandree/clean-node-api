import { InvalidParamError } from '@/presentation/errors'
import { EmailValidator } from '@/presentation/protocols/email-validator'
import { Validation } from '@/presentation/protocols/validation'

export class EmailValidation implements Validation {
	constructor (
		private readonly fieldName: string,
		private readonly emailValidator: EmailValidator
	) { }

	validate (input: any) : Error {
		const isValidEmail = this.emailValidator.isValid(input[this.fieldName])
		if (!isValidEmail) {
			return new InvalidParamError(this.fieldName)
		}

		return null as unknown as Error
	}
}
