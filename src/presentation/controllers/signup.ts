import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'
import { MissingParamError, InvalidParamError, InternalServerError } from '../errors'
import { badRequest } from '../helpers/http-helper'

export class SignUpController implements Controller {
	private readonly emailValidator: EmailValidator

	constructor (emailValidator: EmailValidator) {
		this.emailValidator = emailValidator
	}

  handle (httpRequest: HttpRequest) : HttpResponse {
		try {
			const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

			for (const field of requiredFields) {
				if (!httpRequest.body[field]) {
					return badRequest(new MissingParamError(field))
				}
			}

			const isValidEmail = this.emailValidator.isValid(httpRequest.body.email)
			if (!isValidEmail) {
				return badRequest(new InvalidParamError('email'))
			}

			return { statusCode: 200, body: {} }
		} catch (error) {
			return { statusCode: 500, body: new InternalServerError() }
		}
  }
}
