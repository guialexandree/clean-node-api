import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { SurveyModel } from '../add-survey/db-add-survey-protocols'

export class DbLoadSurveyById implements LoadSurveyById {
	constructor (
		private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
	) {}

	async loadById (id: string): Promise<SurveyModel> {
		const survey = await this.loadSurveyByIdRepository.loadById(id)
		return survey
	}
}
