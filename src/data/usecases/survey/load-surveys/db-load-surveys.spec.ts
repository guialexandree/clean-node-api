import { DbLoadSurveys } from './db-load-surveys-protocols'
import { throwError } from '@/domain/test'
import { LoadSurveysRepositorySpy } from '@/data/test'
import MockDate from 'mockdate'
import faker from 'faker'

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

let accountId: string
describe('DbLoadSurveys UseCase', () => {
	beforeAll(() => {
		MockDate.set(new Date())
	})

	afterAll(() => {
		MockDate.reset()
	})

	beforeEach(() => {
		accountId = faker.datatype.uuid()
	})

	test('Should call LoadSurveysRepository with correct accountId', async () => {
		const { sut, loadSurveysRepositoryStub } = makeSut()

		await sut.load(accountId)

		expect(loadSurveysRepositoryStub.accountId).toBe(accountId)
	})

	test('Should return a list of Surveys on success', async () => {
		const { sut, loadSurveysRepositoryStub } = makeSut()

		const surveys = await sut.load(accountId)

		expect(surveys).toEqual(loadSurveysRepositoryStub.surveysResultModel)
	})

	test('Should throw if LoadSurveysRepository throws', () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveysRepositoryStub, 'loadAll')
      .mockImplementationOnce(throwError)

    const promise = sut.load(accountId)

    void expect(promise).rejects.toThrow()
  })
})
