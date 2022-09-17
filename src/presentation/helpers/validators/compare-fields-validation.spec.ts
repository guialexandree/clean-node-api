import { CompareFieldsValidation } from './compare-fields-validation'
import { InvalidParamError } from '../../errors'

const makeSut = () => {
	return new CompareFieldsValidation('password', 'passwordConfirmation')
}

describe('RequiredField Validation', () => {
	test('Should return a InvalidParamError if validation fails', () => {
		const sut = makeSut()

		const erro = sut.validate({
			name: 'Guilherme',
			email: 'any_email@email.com',
			password: 'any_password',
			passwordConfirmation: 'other_password'
		})

		expect(erro).toEqual(new InvalidParamError('passwordConfirmation'))
	})
})
