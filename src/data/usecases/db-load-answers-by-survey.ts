import { LoadAnswersBySurveyRepository } from '@/data/protocols'
import { LoadAnswersBySurvey } from '@/domain/usecases'

export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey {
	constructor (
		private readonly loadAnswersBysurveyRepository: LoadAnswersBySurveyRepository
	) {}

	async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
		return await this.loadAnswersBysurveyRepository.loadAnswers(id)
	}
}
