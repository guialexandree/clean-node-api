import { DbLoadSurveys } from './db-load-surveys-protocols'
import { throwError } from '@/domain/test'
import { LoadSurveysRepositorySpy } from '@/data/test'
import MockDate from 'mockdate'

type SutTypes = {
	sut: DbLoadSurveys
	loadSurveysRepositoryStub: LoadSurveysRepositorySpy
}

const makeSut = (): SutTypes => {
	const loadSurveysRepositoryStub = new LoadSurveysRepositorySpy()
	const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

  return {
		sut,
		loadSurveysRepositoryStub
	}
}

describe('DbLoadSurveys UseCase', () => {
	beforeAll(() => {
		MockDate.set(new Date())
	})

	afterAll(() => {
		MockDate.reset()
	})

	test('Should call LoadSurveysRepository', async () => {
		const { sut, loadSurveysRepositoryStub } = makeSut()

		await sut.load()

		expect(loadSurveysRepositoryStub.callsCount).toBe(1)
	})

	test('Should return a list of Surveys on success', async () => {
		const { sut, loadSurveysRepositoryStub } = makeSut()

		const surveys = await sut.load()

		expect(surveys).toEqual(loadSurveysRepositoryStub.surveysResultModel)
	})

	test('Should throw if LoadSurveysRepository throws', () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveysRepositoryStub, 'loadAll')
      .mockImplementationOnce(throwError)

    const promise = sut.load()

    void expect(promise).rejects.toThrow()
  })
})
