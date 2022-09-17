import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredField Validation', () => {
	test('Should return a MissingParamError if validation fails', () => {
		const fieldName = 'any_field'
		const sut = new RequiredFieldValidation(fieldName)

		const erro = sut.validate({ name: 'Guilherme' })

		expect(erro).toEqual(new MissingParamError(fieldName))
	})

	test('Should return null if validation on success', () => {
		const fieldName = 'email'
		const sut = new RequiredFieldValidation(fieldName)

		const erro = sut.validate({
			name: 'Guilherme',
			email: 'any_email@email.com',
			password: 'any_password',
			passwordConfirmation: 'any_password'
		})

		expect(erro).toBeNull()
	})
})
