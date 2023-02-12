import { type SurveyModel } from '@/domain/models'
import { type AddSurvey } from '@/domain/usecases'
import { type AddSurveyRepository, type CheckSurveyByIdRepository, type LoadAnswersBySurveyRepository, type LoadSurveyByIdRepository, type LoadSurveysRepository } from '@/data/protocols'
import { mockSurveyModel, mockSurveysModel } from '@/tests/domain/mocks'
import faker from 'faker'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
	addSurveyParams: AddSurvey.Params

	async add (data: AddSurvey.Params): Promise<void> {
		this.addSurveyParams = data
		await Promise.resolve()
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

export class LoadAnswersBySurveyRepositorySpy implements LoadAnswersBySurveyRepository {
	result = [faker.random.word(), faker.random.word()]
	id: string

	async loadAnswers (id: string): Promise<LoadAnswersBySurveyRepository.Result> {
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
