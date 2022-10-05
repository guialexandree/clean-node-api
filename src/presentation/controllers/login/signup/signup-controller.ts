import { Controller, HttpRequest, HttpResponse, AddAccount, Validation, Authentication } from './signup-controller-protocols'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { EmailInUseError } from '@/presentation/errors'

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

			if (!account) {
				return forbidden(new EmailInUseError())
			}

			const accessToken = await this.authentication.auth({
				email,
				password
			})

			return ok({ accessToken })
		} catch (error) {
			return serverError(error as Error)
		}
  }
}
