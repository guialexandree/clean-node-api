import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAccount } from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'

export class SignUpController implements Controller {
	private readonly emailValidator: EmailValidator
	private readonly addAccount: AddAccount

	constructor (emailValidator: EmailValidator, addAccountStub: AddAccount) {
		this.emailValidator = emailValidator
		this.addAccount = addAccountStub
	}

  handle (httpRequest: HttpRequest) : HttpResponse {
		try {
			const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

			for (const field of requiredFields) {
				if (!httpRequest.body[field]) {
					return badRequest(new MissingParamError(field))
				}
			}

			const { name, password, passwordConfirmation } = httpRequest.body
			if (password !== passwordConfirmation) {
				return badRequest(new InvalidParamError('passwordConfirmation'))
			}

			const { email } = httpRequest.body
			const isValidEmail = this.emailValidator.isValid(email)
			if (!isValidEmail) {
				return badRequest(new InvalidParamError('email'))
			}

			const account = this.addAccount.add({
				name,
				email,
				password
			})

			return { statusCode: 201, body: account }
		} catch (error) {
			return serverError()
		}
  }
}
