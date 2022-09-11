import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/http-helper'
import { EmailValidator } from '../../../presentation/protocols/email-validator'

export class SignInController implements Controller {
	private readonly emailValidator: EmailValidator

	constructor (emailValidator: EmailValidator) {
		this.emailValidator = emailValidator
	}

	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		const { email } = httpRequest.body
		if (!email) {
			return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
		}

		const { password } = httpRequest.body
		if (!password) {
			return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
		}

		this.emailValidator.isValid(email)

		return new Promise(resolve => resolve(ok({ ok: 'ok' })))
	}
}
