import { SurveyModel } from '@/domain/models'
import { AddSurvey, LoadSurveyById, LoadSurveys } from '@/domain/usecases'
import { mockSurveyModel, mockSurveysModel } from '@/tests/domain/mocks'

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

export class LoadSurveyByIdSpy implements LoadSurveyById {
	surveyModel = mockSurveyModel()
  id: string

  async loadById (id: string): Promise<SurveyModel> {
    this.id = id
    return await Promise.resolve(this.surveyModel)
  }
}
