import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
	private controller: Controller

	constructor (controller: Controller) {
		this.controller = controller
	}

	async handle (httpRequest: HttpRequest) : Promise<HttpResponse> {
		const response = await this.controller.handle(httpRequest)

		if (response.statusCode === 500) {
			console.log('Internal Error\n', response.body)
		}

		return response
	}
}
