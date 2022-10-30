import { mockSurveyModel, mockSurveysModel } from '@/domain/test'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'

export const mockDbAddSurveyRepository = (): AddSurveyRepository => {
  class DbAddSurveyRepositoryStub implements AddSurveyRepository {
    async add (dataSurvey: AddSurveyParams): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new DbAddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
	class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
		async loadById (id: string): Promise<SurveyModel> {
			return await new Promise(resolve => resolve(mockSurveyModel()))
		}
	}

	return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
	class LoadSurveysRepositoryStub implements LoadSurveysRepository {
		async loadAll (): Promise<SurveyModel[]> {
			return await new Promise(resolve => resolve(mockSurveysModel()))
		}
	}

	return new LoadSurveysRepositoryStub()
}
