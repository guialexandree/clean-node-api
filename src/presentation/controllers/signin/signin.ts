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

			const token = await this.authentication.auth(email, password)

			return new Promise(resolve => resolve(ok({ token })))
		} catch (error) {
			return serverError(error as Error)
		}
	}
}
