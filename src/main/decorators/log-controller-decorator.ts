import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'

export class LogControllerDecorator implements Controller {
	private controller: Controller
	private logErrorRepository: LogErrorRepository

	constructor (controller: Controller, logErrorRepository: LogErrorRepository) {
		this.controller = controller
		this.logErrorRepository = logErrorRepository
	}

	async handle (httpRequest: HttpRequest) : Promise<HttpResponse> {
		const response = await this.controller.handle(httpRequest)

		if (response.statusCode === 500) {
			await this.logErrorRepository.logError(response.body.stack)
		}

		return response
	}
}
