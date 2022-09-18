import { Validation } from '../../protocols'

export class ValidationComposite implements Validation {
	private readonly validations: Validation[]

	constructor (validations: Validation[]) {
		this.validations = validations
	}

	validate (input: any) : Error {
		for (const validation of this.validations) {
			const erro = validation.validate(input)
			if (erro) {
				return erro
			}
		}

		return null as unknown as Error
	}
}
