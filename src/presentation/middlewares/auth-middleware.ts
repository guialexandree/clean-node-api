import { LoadByAccountByToken, HttpRequest, HttpResponse, Middleware } from './auth-middleware-protocols'
import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'

export class AuthMiddleware implements Middleware {
	constructor (
		private readonly loadAccountByToken: LoadByAccountByToken,
		private readonly role: string
	) {}

	async handle (httpRequest: HttpRequest) : Promise<HttpResponse> {
		try {
			const { headers } = httpRequest
			const accessToken : string = headers?.['x-access-token']

			if (accessToken) {
				const account = await this.loadAccountByToken.load(accessToken, this.role)
				if (account) {
					return ok({ accountId: account.id })
				}
			}

			return forbidden(new AccessDeniedError())
		} catch (error) {
			return serverError(error)
		}
	}
}
