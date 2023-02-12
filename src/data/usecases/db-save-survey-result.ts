import { type SaveSurveyResult } from '@/domain/usecases'
import { type LoadSurveyResultRepository, type SaveSurveyResultRepository } from '@/data/protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
	constructor (
		private readonly dbSaveSurveyResultRepository: SaveSurveyResultRepository,
		private readonly dbLoadSurveyResultRepository: LoadSurveyResultRepository
	) {}

	async save (data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
		await this.dbSaveSurveyResultRepository.save(data)
		const surveyResult = await this.dbLoadSurveyResultRepository.loadBySurveyId(data.surveyId, data.accountId)
		return surveyResult
	}
}
