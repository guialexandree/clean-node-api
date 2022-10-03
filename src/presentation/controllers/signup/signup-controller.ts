import { Controller, HttpRequest, HttpResponse, AddAccount, Validation, Authentication } from './signup-controller-protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http/http-helper'

export class SignUpController implements Controller {
	constructor (
		private readonly addAccount: AddAccount,
		private readonly validation: Validation,
		private readonly authentication: Authentication
	) {}

  async handle (httpRequest: HttpRequest) : Promise<HttpResponse> {
		try {
			const erro = this.validation.validate(httpRequest.body)
			if (erro) {
				return badRequest(erro)
			}

			const { name, password, email } = httpRequest.body

			const account = await this.addAccount.add({
				name,
				email,
				password
			})

			await this.authentication.auth({
				email,
				password
			})

			return ok(account)
		} catch (error) {
			return serverError(error as Error)
		}
  }
}
