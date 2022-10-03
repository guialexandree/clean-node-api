
import { Validation, Authentication, Controller, HttpRequest, HttpResponse } from './signin-controller-protocols'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'

export class SignInController implements Controller {
	constructor (
		private readonly authentication: Authentication,
		private readonly validation: Validation
	) { }

	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const erro = this.validation.validate(httpRequest.body)
			if (erro) {
				return badRequest(erro)
			}

			const { email, password } = httpRequest.body

			const accessToken = await this.authentication.auth({ email, password })
			if (!accessToken) {
				return unauthorized()
			}

			return ok({ accessToken })
		} catch (error) {
			return serverError(error as Error)
		}
	}
}
