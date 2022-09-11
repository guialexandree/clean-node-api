import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'

export class SignInController implements Controller {
	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
	}
}
