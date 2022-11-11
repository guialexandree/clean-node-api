import { DbSaveSurveyResult } from './db-save-survey-result'
import { mockSaveSurveyResultParams, throwError } from '@/domain/test'
import { LoadSurveyResultRepositorySpy, SaveSurveyResultRepositorySpy } from '@/data/test'
import MockDate from 'mockdate'

interface SutTypes {
  sut: DbSaveSurveyResult
  dbSaveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy
  dbLoadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
}

const makeSut = (): SutTypes => {
  const dbSaveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy()
  const dbLoadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const sut = new DbSaveSurveyResult(dbSaveSurveyResultRepositorySpy, dbLoadSurveyResultRepositorySpy)

  return {
    sut,
    dbSaveSurveyResultRepositorySpy,
		dbLoadSurveyResultRepositorySpy
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
    const { sut, dbSaveSurveyResultRepositorySpy } = makeSut()
		const saveSurveyData = mockSaveSurveyResultParams()
    await sut.save(saveSurveyData)

    expect(dbSaveSurveyResultRepositorySpy.saveSurveyParams).toEqual(saveSurveyData)
  })

	test('Should throw if DbSaveSurveyResultRepository throws', () => {
    const { sut, dbSaveSurveyResultRepositorySpy } = makeSut()
    jest
      .spyOn(dbSaveSurveyResultRepositorySpy, 'save')
      .mockImplementationOnce(throwError)

    const promise = sut.save(mockSaveSurveyResultParams())

    void expect(promise).rejects.toThrow()
  })

	test('Should DbLoadSurveyByIdRepository with correct values', async () => {
    const { sut, dbLoadSurveyResultRepositorySpy } = makeSut()
		const surveyResultData = mockSaveSurveyResultParams()
    await sut.save(surveyResultData)

    expect(dbLoadSurveyResultRepositorySpy.surveyId).toBe(surveyResultData.surveyId)
  })

	test('Should throw if DbLoadSurveyByIdRepository throws', () => {
    const { sut, dbLoadSurveyResultRepositorySpy } = makeSut()
    jest
      .spyOn(dbLoadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockImplementationOnce(throwError)

    const promise = sut.save(mockSaveSurveyResultParams())

    void expect(promise).rejects.toThrow()
  })

	test('Should return SurveyResult on success', async () => {
		const { sut, dbLoadSurveyResultRepositorySpy } = makeSut()

		const surveyResult = await sut.save(mockSaveSurveyResultParams())

		expect(surveyResult).toEqual(dbLoadSurveyResultRepositorySpy.surveyResultModel)
	})
})
