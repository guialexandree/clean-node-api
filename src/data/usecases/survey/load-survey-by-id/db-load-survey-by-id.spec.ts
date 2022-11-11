import { DbLoadSurveyById } from './db-load-survey-by-id-protocols'
import { throwError } from '@/domain/test'
import { LoadSurveyByIdRepositorySpy } from '@/data/test'
import MockDate from 'mockdate'
import faker from 'faker'

type SutTypes = {
	sut: DbLoadSurveyById
	loadSurveyByIdRepositoryStub: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
	const loadSurveyByIdRepositoryStub = new LoadSurveyByIdRepositorySpy()
	const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)

  return {
		sut,
		loadSurveyByIdRepositoryStub
	}
}

let surveyId: string

describe('DbLoadSurveyById UseCase', () => {
	beforeAll(() => {
		MockDate.set(new Date())
	})

	afterAll(() => {
		MockDate.reset()
	})

	beforeEach(() => {
    surveyId = faker.datatype.uuid()
  })

	test('Should call LoadSurveyByIdRepository with correct id', async () => {
		const { sut, loadSurveyByIdRepositoryStub } = makeSut()

		await sut.loadById(surveyId)

		expect(loadSurveyByIdRepositoryStub.id).toBe(surveyId)
	})

	test('Should return a list of Survey on success', async () => {
		const { sut, loadSurveyByIdRepositoryStub } = makeSut()

		const surveys = await sut.loadById(surveyId)

		expect(surveys).toEqual(loadSurveyByIdRepositoryStub.surveyModel)
	})

	test('Should throw if LoadSurveyByIdRepository throws', () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockImplementationOnce(throwError)

    const promise = sut.loadById(surveyId)

    void expect(promise).rejects.toThrow()
  })
})
