import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (fieldName: string) => {
	return new RequiredFieldValidation(fieldName)
}

describe('RequiredField Validation', () => {
	test('Should return a MissingParamError if validation fails', () => {
		const fieldName = 'email'
		const sut = makeSut(fieldName)

		const erro = sut.validate({ name: 'Guilherme' })

		expect(erro).toEqual(new MissingParamError(fieldName))
	})

	test('Should return null if validation on success', () => {
		const sut = makeSut('email')

		const erro = sut.validate({
			name: 'Guilherme',
			email: 'any_email@email.com',
			password: 'any_password',
			passwordConfirmation: 'any_password'
		})

		expect(erro).toBeNull()
	})
})
