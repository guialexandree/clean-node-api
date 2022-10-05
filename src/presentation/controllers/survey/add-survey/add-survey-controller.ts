import { AddSurvey, Controller, HttpRequest, HttpResponse, Validation } from './add-survey-controller-protocols'
import { badRequest } from '@/presentation/helpers/http/http-helper'

export class AddSurveyController implements Controller {
	constructor (
		private readonly validation: Validation,
		private readonly addSurvey: AddSurvey
	) {}

	async handle (httpRequest: HttpRequest) : Promise<HttpResponse> {
		const error = this.validation.validate(httpRequest.body)
		if (error) {
			return badRequest(error)
		}

		await this.addSurvey.add(httpRequest.body)

		return new Promise(resolve => resolve(null as unknown as HttpResponse))
	}
}
