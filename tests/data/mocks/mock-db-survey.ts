import { SurveyModel } from '@/domain/models'
import { AddSurveyParams } from '@/domain/usecases'
import { AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '@/data/protocols'
import { mockSurveyModel, mockSurveysModel } from '@/tests/domain/mocks'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
	addSurveyParams: AddSurveyParams

	async add (data: AddSurveyParams): Promise<void> {
		this.addSurveyParams = data
		return await Promise.resolve()
	}
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
	surveyModel = mockSurveyModel()
	id: string

	async loadById (id: string): Promise<SurveyModel> {
		this.id = id
		return await Promise.resolve(this.surveyModel)
	}
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
	surveysResultModel = mockSurveysModel()
	accountId: string

	async loadAll (accountId: string): Promise<SurveyModel[]> {
		this.accountId = accountId
		return await Promise.resolve(this.surveysResultModel)
	}
}
