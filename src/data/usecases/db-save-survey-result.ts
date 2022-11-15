import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases'
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
	constructor (
		private readonly dbSaveSurveyResultRepository: SaveSurveyResultRepository,
		private readonly dbLoadSurveyResultRepository: LoadSurveyResultRepository
	) {}

	async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
		await this.dbSaveSurveyResultRepository.save(data)
		const surveyResult = await this.dbLoadSurveyResultRepository.loadBySurveyId(data.surveyId, data.accountId)
		return surveyResult
	}
}
