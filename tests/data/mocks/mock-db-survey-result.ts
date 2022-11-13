import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/usecases'
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
	saveSurveyParams: SaveSurveyResultParams

	async save (data: SaveSurveyResultParams): Promise<void> {
		this.saveSurveyParams = data
		return await Promise.resolve()
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
