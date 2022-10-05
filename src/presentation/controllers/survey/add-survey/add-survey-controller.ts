import { badRequest } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'

export class AddSurveyController implements Controller {
	constructor (
		private readonly validation: Validation
	) {}

	async handle (httpRequest: HttpRequest) : Promise<HttpResponse> {
		const error = this.validation.validate(httpRequest.body)
		if (error) {
			return badRequest(error)
		}
		return new Promise(resolve => resolve(null as unknown as HttpResponse))
	}
}
