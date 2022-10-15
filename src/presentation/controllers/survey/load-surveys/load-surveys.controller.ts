import { Controller, HttpRequest } from '../add-survey/add-survey-controller-protocols'
import { LoadSurveys } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
	constructor (
		private readonly loadSurveys: LoadSurveys
	) {}

	async handle (httpRequest: HttpRequest): Promise<any> {
		await this.loadSurveys.load()
		return null
	}
}
