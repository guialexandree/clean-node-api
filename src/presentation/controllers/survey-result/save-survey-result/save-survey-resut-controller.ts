import { LoadSurveyById, Controller, HttpResponse, HttpRequest } from './save-survey-resut-controller-protocols'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'

export class SaveSurveyResultController implements Controller {
	constructor (
		private readonly loadSurveyById: LoadSurveyById
	) {}

	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const { surveyId } = httpRequest.params
			const survey = await this.loadSurveyById.loadById(surveyId)

			if (survey) {
				const { answer } = httpRequest.body
				const answers = survey.answers.map(a => a.answer)
				if (!answers.includes(answer)) {
					return forbidden(new InvalidParamError('answer'))
				}
			} else {
				return forbidden(new InvalidParamError('surveyId'))
			}

			return null
		} catch (error) {
			return serverError(error)
		}
	}
}
