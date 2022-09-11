import { SignInController } from './sign'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'

describe('SignIn Controller', () => {
	const makeSut = () : SignInController => {
		return new SignInController()
	}

	test('Should return 400 if no email is provied', async () => {
		const sut = makeSut()
		const fakeRequest = {
			body: { password: 'any_password' }
		}
		const result = await sut.handle(fakeRequest)

		expect(result).toEqual(badRequest(new MissingParamError('email')))
	})

	test('Should return 400 if no password is provied', async () => {
		const sut = makeSut()
		const fakeRequest = {
			body: { email: 'email@email.com' }
		}
		const result = await sut.handle(fakeRequest)

		expect(result).toEqual(badRequest(new MissingParamError('password')))
	})
})
