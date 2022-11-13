import {
	SurveyResultModel,
	SaveSurveyResultRepository,
	LoadSurveyResultRepository,
	SaveSurveyResult,
	SaveSurveyResultParams
} from './db-save-survey-result-protocols'

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
