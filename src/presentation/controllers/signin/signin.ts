import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { Authentication } from '../../../domain/usecases/authentication'
import { UnauthorizedError } from '../../errors/unauthorized-error'

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

			const accessToken = await this.authentication.auth(email, password)
			if (!accessToken) {
				return unauthorized()
			}
			return ok({ ok: 'ok' })
			// return ok({ accessToken })
		} catch (error) {
			return serverError(error as Error)
		}
	}
}
