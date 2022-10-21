import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '../add-survey/db-add-survey-protocols'

const makeFakeSurvey = (): SurveyModel => {
	return {
		id: 'any_id',
		question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }, {
        answer: 'other_answer'
      }
    ],
		date: new Date()
	}
}

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
	class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
		async loadById (id: string): Promise<SurveyModel> {
			return await new Promise(resolve => resolve(makeFakeSurvey()))
		}
	}

	return new LoadSurveyByIdRepositoryStub()
}

type SutTypes = {
	sut: DbLoadSurveyById
	loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
	const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository()
	const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)

  return {
		sut,
		loadSurveyByIdRepositoryStub
	}
}

describe('DbLoadSurveyById UseCase', () => {
	test('Should call LoadSurveyByIdRepository with correct id', async () => {
		const { sut, loadSurveyByIdRepositoryStub } = makeSut()
		const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')

		await sut.loadById('any_id')

		expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
	})
})
