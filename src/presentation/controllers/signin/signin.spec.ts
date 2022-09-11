import { SignInController } from './sign'
import { HttpRequest } from '../../protocols'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'

describe('SignIn Controller', () => {
	const makeSut = () : SignInController => {
		return new SignInController()
	}

	const makeRequest = () : HttpRequest => ({
		body: {}
	})

	test('Should return 400 if no email is provied', async () => {
		const sut = makeSut()

		const result = await sut.handle(makeRequest())

		expect(result).toEqual(badRequest(new MissingParamError('email')))
	})
})
