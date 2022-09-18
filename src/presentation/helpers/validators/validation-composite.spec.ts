import { InvalidParamError, MissingParamError } from '../../errors'
import { Validation } from '../../protocols/validation'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
	sut: ValidationComposite,
	validationStubs: Validation[]
}

const makeValidation = () => {
	class ValidationStub implements Validation {
		validate (input: any): Error {
			return null as unknown as Error
		}
	}

	return new ValidationStub()
}

const makeSut = () : SutTypes => {
	const validationStubs : Validation[] = [
		makeValidation(),
		makeValidation()
	]
	const sut = new ValidationComposite(validationStubs)

	return {
		sut,
		validationStubs
	}
}

describe('Validation Composite', () => {
	test('Should return an error if any validation fails', () => {
		const { sut, validationStubs } = makeSut()

		jest
			.spyOn(validationStubs[1], 'validate')
			.mockReturnValueOnce(new MissingParamError('field'))
		const erro = sut.validate({ field: 'any_value' })

		expect(erro).toEqual(new MissingParamError('field'))
	})

	test('Should return the first error if more then one validation fails', () => {
		const { sut, validationStubs } = makeSut()

		jest
			.spyOn(validationStubs[0], 'validate')
			.mockReturnValueOnce(new InvalidParamError('field'))
		jest
			.spyOn(validationStubs[1], 'validate')
			.mockReturnValueOnce(new MissingParamError('field'))

		const erro = sut.validate({ field: 'any_value' })

		expect(erro).toEqual(new InvalidParamError('field'))
	})

	test('Should return null if all validations on success', () => {
		const { sut } = makeSut()

		const erro = sut.validate({ field: 'any_value' })

		expect(erro).toBeNull()
	})
})
