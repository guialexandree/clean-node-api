import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'

describe('SignUp Controller', () => {
	test('Should return status 400 if no name is provided', () => {
		const sut = new SignUpController()
		const httpRequest = {
			body: {
				email: 'email@email.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}

		const httpResponse = sut.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(badRequest(new MissingParamError('name')))
	})

	test('Should return status 400 if no email is provided', () => {
		const sut = new SignUpController()
		const httpRequest = {
			body: {
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}

		const httpResponse = sut.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(badRequest(new MissingParamError('email')))
	})
})
