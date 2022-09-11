import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { Authentication } from '../../../domain/usecases/authentication'

export class SignInController implements Controller {
	private readonly emailValidator: EmailValidator
	private readonly authentication: Authentication

	constructor (emailValidator: EmailValidator, authentication: Authentication) {
		this.emailValidator = emailValidator
		this.authentication = authentication
	}

	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const requiredFields = ['email', 'password']
			for (const field of requiredFields) {
				if (!httpRequest.body[field]) {
					return badRequest(new MissingParamError(field))
				}
			}

			const { email, password } = httpRequest.body
			const isValid = this.emailValidator.isValid(email)
			if (!isValid) {
				return badRequest(new InvalidParamError('email'))
			}

			const token = await this.authentication.auth(email, password)

			return ok({ token })
		} catch (error) {
			return serverError(error as Error)
		}
	}
}
