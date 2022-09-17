import { CompareFieldsValidation } from './compare-fields-validation'
import { InvalidParamError } from '../../errors'

const makeSut = () => {
	return new CompareFieldsValidation('field', 'fieldCompare')
}

describe('RequiredField Validation', () => {
	test('Should return a InvalidParamError if validation fails', () => {
		const sut = makeSut()

		const erro = sut.validate({
			field: 'any_password',
			fieldCompare: 'other_password'
		})

		expect(erro).toEqual(new InvalidParamError('fieldCompare'))
	})

	test('Should return null if validation on success', () => {
		const sut = makeSut()

		const erro = sut.validate({
			field: 'any_password',
			fieldCompare: 'any_password'
		})

		expect(erro).toBeNull()
	})
})
