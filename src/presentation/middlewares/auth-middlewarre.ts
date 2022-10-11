import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'

export class AuthMiddleware implements Middleware {
	async handle (httpRequest: HttpRequest) : Promise<HttpResponse> {
		return new Promise(resolve => resolve(forbidden(new AccessDeniedError())))
	}
}
