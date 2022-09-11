import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { EmailValidator } from '../../../presentation/protocols/email-validator'

export class SignInController implements Controller {
	private readonly emailValidator: EmailValidator

	constructor (emailValidator: EmailValidator) {
		this.emailValidator = emailValidator
	}

	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const { email } = httpRequest.body
			if (!email) {
				return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
			}

			const { password } = httpRequest.body
			if (!password) {
				return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
			}

			const isValid = this.emailValidator.isValid(email)
			if (!isValid) {
				return new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
			}

			return new Promise(resolve => resolve(ok({ ok: 'ok' })))
		} catch (error) {
			return serverError(error as Error)
		}
	}
}
