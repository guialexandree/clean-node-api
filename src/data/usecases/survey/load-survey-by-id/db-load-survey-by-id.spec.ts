import { DbLoadSurveyById, LoadSurveyByIdRepository } from './db-load-survey-by-id-protocols'
import MockDate from 'mockdate'
import { mockSurveyModel, throwError } from '@/domain/test'
import { mockLoadSurveyByIdRepository } from '@/data/test'

type SutTypes = {
	sut: DbLoadSurveyById
	loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
	const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
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

		expect(surveys).toEqual(mockSurveyModel())
	})

	test('Should throw if LoadSurveyByIdRepository throws', () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockImplementationOnce(throwError)

    const promise = sut.loadById('any_id')

    void expect(promise).rejects.toThrow()
  })
})
