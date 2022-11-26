import { SurveyModel } from '@/domain/models'
import { AddSurvey } from '@/domain/usecases'
import { AddSurveyRepository, CheckSurveyByIdRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '@/data/protocols'
import { mockSurveyModel, mockSurveysModel } from '@/tests/domain/mocks'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
	addSurveyParams: AddSurvey.Params

	async add (data: AddSurvey.Params): Promise<void> {
		this.addSurveyParams = data
		return await Promise.resolve()
	}
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
	result = mockSurveyModel()
	id: string

	async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
		this.id = id
		return await Promise.resolve(this.result)
	}
}

export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
	result = true
	id: string

	async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
		this.id = id
		return await Promise.resolve(this.result)
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
