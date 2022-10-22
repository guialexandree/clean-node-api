import { SurveyResultModel, SaveSurveyResultRepository, SaveSurveyResult } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
	constructor (
		private readonly dbSaveSurveyResultRepository: SaveSurveyResultRepository
	) {}

	async save (data: SurveyResultModel): Promise<SurveyResultModel> {
		await this.dbSaveSurveyResultRepository.save(data)
		return null
	}
}
