import { mockSurveyModel, mockSurveysModel } from '@/domain/test'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'

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
	callsCount = 0

	async loadAll (): Promise<SurveyModel[]> {
		this.callsCount++
		return await Promise.resolve(this.surveysResultModel)
	}
}
