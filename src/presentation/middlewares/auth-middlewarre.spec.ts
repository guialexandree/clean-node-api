import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden } from '../helpers/http/http-helper'
import { AuthMiddleware } from './auth-middlewarre'

describe('Auth Middleware', () => {
	test('Should return 403 if no x-access-token exist in header', async () => {
		const sut = new AuthMiddleware()

		const response = await sut.handle({})

		expect(response).toEqual(forbidden(new AccessDeniedError()))
	})
})
