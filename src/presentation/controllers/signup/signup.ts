import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAccount, Validation } from './signup-protocols'
import { InvalidParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'

export class SignUpController implements Controller {
	private readonly emailValidator: EmailValidator
	private readonly addAccount: AddAccount
	private readonly validation: Validation

	constructor (emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
		this.emailValidator = emailValidator
		this.addAccount = addAccount
		this.validation = validation
	}

  async handle (httpRequest: HttpRequest) : Promise<HttpResponse> {
		try {
			const erro = this.validation.validate(httpRequest.body)
			if (erro) {
				return badRequest(erro)
			}

			const { name, password, email } = httpRequest.body
			const isValidEmail = this.emailValidator.isValid(email)
			if (!isValidEmail) {
				return badRequest(new InvalidParamError('email'))
			}

			const account = await this.addAccount.add({
				name,
				email,
				password
			})

			return ok(account)
		} catch (error) {
			return serverError(error as Error)
		}
  }
}
