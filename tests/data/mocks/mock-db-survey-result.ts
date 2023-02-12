import { type SurveyResultModel } from '@/domain/models'
import { type LoadSurveyResultRepository, type SaveSurveyResultRepository } from '@/data/protocols'
import { mockSurveyResultModel } from '@/tests/domain/mocks'
import { type SaveSurveyResult } from '@/domain/usecases'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
	saveSurveyParams: SaveSurveyResult.Params

	async save (data: SaveSurveyResult.Params): Promise<void> {
		this.saveSurveyParams = data
		await Promise.resolve()
	}
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
	surveyResultModel = mockSurveyResultModel()
	surveyId: string
	accountId: string

	async loadBySurveyId (surveyId: string, accountId: string): Promise<SurveyResultModel> {
		this.surveyId = surveyId
		this.accountId = accountId
		return await Promise.resolve(this.surveyResultModel)
	}
}
