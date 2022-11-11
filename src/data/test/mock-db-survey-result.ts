import { mockSurveyResultModel } from '@/domain/test'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'

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

	async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
		this.surveyId = surveyId
		return await Promise.resolve(this.surveyResultModel)
	}
}
