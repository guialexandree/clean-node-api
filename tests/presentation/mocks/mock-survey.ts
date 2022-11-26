import { SurveyModel } from '@/domain/models'
import { AddSurvey, CheckSurveyById, LoadAnswersBySurvey, LoadSurveys } from '@/domain/usecases'
import { mockSurveysModel } from '@/tests/domain/mocks'
import faker from 'faker'

export class AddSurveySpy implements AddSurvey {
	addSurveyParams: AddSurvey.Params

  async add (data: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = data
    return await Promise.resolve()
  }
}

export class LoadSurveysSpy implements LoadSurveys {
	surveyModels = mockSurveysModel()
	accountId: string

	async load (accountId: string): Promise<SurveyModel[]> {
		this.accountId = accountId
		return await Promise.resolve(this.surveyModels)
	}
}

export class LoadAnswersBySurveySpy implements LoadAnswersBySurvey {
	result = [faker.random.word(), faker.random.word()]
  id: string

  async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
    this.id = id
    return await Promise.resolve(this.result)
  }
}

export class CheckSurveyByIdSpy implements CheckSurveyById {
	result = true
  id: string

  async checkById (id: string): Promise<CheckSurveyById.Result> {
    this.id = id
    return await Promise.resolve(this.result)
  }
}
