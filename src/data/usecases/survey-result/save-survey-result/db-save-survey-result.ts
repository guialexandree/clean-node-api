import {
	SurveyResultModel,
	SaveSurveyResultRepository,
	SaveSurveyResult,
	SaveSurveyResultModel
} from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
	constructor (
		private readonly dbSaveSurveyResultRepository: SaveSurveyResultRepository
	) {}

	async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
		const survey = await this.dbSaveSurveyResultRepository.save(data)
		return survey
	}
}
