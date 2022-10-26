import { DbLoadSurveyById, LoadSurveyByIdRepository, SurveyModel } from './db-load-survey-by-id-protocols'
import MockDate from 'mockdate'

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
	beforeAll(() => {
		MockDate.set(new Date())
	})

	afterAll(() => {
		MockDate.reset()
	})

	test('Should call LoadSurveyByIdRepository with correct id', async () => {
		const { sut, loadSurveyByIdRepositoryStub } = makeSut()
		const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')

		await sut.loadById('any_id')

		expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
	})

	test('Should return a list of Survey on success', async () => {
		const { sut } = makeSut()

		const surveys = await sut.loadById('any_id')

		expect(surveys).toEqual(makeFakeSurvey())
	})

	test('Should throw if LoadSurveyByIdRepository throws', () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.loadById('any_id')

    void expect(promise).rejects.toThrow()
  })
})
