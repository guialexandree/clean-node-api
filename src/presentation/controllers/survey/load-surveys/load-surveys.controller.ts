import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../add-survey/add-survey-controller-protocols'
import { LoadSurveys } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
	constructor (
		private readonly loadSurveys: LoadSurveys
	) {}

	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const surveys = await this.loadSurveys.load()
			return ok(surveys)
		} catch (error) {
			return serverError(error)
		}
	}
}
