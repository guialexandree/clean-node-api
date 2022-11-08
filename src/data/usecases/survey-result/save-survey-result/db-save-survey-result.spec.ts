import { DbSaveSurveyResult } from './db-save-survey-result'
import { mockSurveyResultModel, mockSaveSurveyResultParams, throwError } from '@/domain/test'
import { mockLoadSurveyResultRepository, mockSaveSurveyResultRepository } from '@/data/test'
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from './db-save-survey-result-protocols'
import MockDate from 'mockdate'

interface SutTypes {
  sut: DbSaveSurveyResult
  dbSaveSurveyResultRepositoryStub: SaveSurveyResultRepository
  dbLoadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const dbSaveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const dbLoadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbSaveSurveyResult(dbSaveSurveyResultRepositoryStub, dbLoadSurveyResultRepositoryStub)

  return {
    sut,
    dbSaveSurveyResultRepositoryStub,
		dbLoadSurveyResultRepositoryStub
  }
}

describe('DbAddSurvey Usecase', () => {
	beforeAll(() => {
		MockDate.set(new Date())
	})

	afterAll(() => {
		MockDate.reset()
	})

  test('Should call DbSaveSurveyResultRepository with correct values', async () => {
    const { sut, dbSaveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(dbSaveSurveyResultRepositoryStub, 'save')

    await sut.save(mockSaveSurveyResultParams())

    expect(saveSpy).toHaveBeenCalledWith(mockSaveSurveyResultParams())
  })

	test('Should throw if DbSaveSurveyResultRepository throws', () => {
    const { sut, dbSaveSurveyResultRepositoryStub } = makeSut()
    jest
      .spyOn(dbSaveSurveyResultRepositoryStub, 'save')
      .mockImplementationOnce(throwError)

    const promise = sut.save(mockSaveSurveyResultParams())

    void expect(promise).rejects.toThrow()
  })

	test('Should DbLoadSurveyByIdRepository with correct values', async () => {
    const { sut, dbLoadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(dbLoadSurveyResultRepositoryStub, 'loadBySurveyId')
		const surveyResultParams = mockSaveSurveyResultParams()
    await sut.save(surveyResultParams)

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyResultParams.surveyId)
  })

	test('Should throw if DbLoadSurveyByIdRepository throws', () => {
    const { sut, dbLoadSurveyResultRepositoryStub } = makeSut()
    jest
      .spyOn(dbLoadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockImplementationOnce(throwError)

    const promise = sut.save(mockSaveSurveyResultParams())

    void expect(promise).rejects.toThrow()
  })

	test('Should return SurveyResult on success', async () => {
		const { sut } = makeSut()
		const surveyData = mockSaveSurveyResultParams()
		const surveys = await sut.save(surveyData)

		expect(surveys).toEqual(mockSurveyResultModel())
	})
})
