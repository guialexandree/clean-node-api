import { mockSurveyModel, mockSurveysModel } from '@/domain/test'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'

export const mockLoadSurveys = (): LoadSurveys => {
	class LoadSurveysStub implements LoadSurveys {
		async load (): Promise<SurveyModel[]> {
			return await new Promise(resolve => resolve(mockSurveysModel()))
		}
	}

	return new LoadSurveysStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
	class LoadSurveyByIdStub implements LoadSurveyById {
		async loadById (id: string): Promise<SurveyModel> {
			return await new Promise(resolve => resolve(mockSurveyModel()))
		}
	}

	return new LoadSurveyByIdStub()
}
