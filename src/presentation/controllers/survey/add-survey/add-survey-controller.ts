import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'

export class AddSurveyController implements Controller {
	constructor (
		private readonly validation: Validation
	) {}

	async handle (httpRequest: HttpRequest) : Promise<HttpResponse> {
		this.validation.validate(httpRequest.body)
		return new Promise(resolve => resolve(null as unknown as HttpResponse))
	}
}
