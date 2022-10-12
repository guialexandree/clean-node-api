import { LoadByAccountByToken } from '@/domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden, ok } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
	constructor (
		private readonly loadAccountByToken: LoadByAccountByToken
	) {}

	async handle (httpRequest: HttpRequest) : Promise<HttpResponse> {
		const { headers } = httpRequest
		const accessToken : string = headers?.['x-access-token']

		if (accessToken) {
			await this.loadAccountByToken.load(accessToken)
		}

		return forbidden(new AccessDeniedError())
	}
}
