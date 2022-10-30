import { mockSurveyResultModel, mockSaveSurveyResultParams, throwError } from '@/domain/test'
import { DbSaveSurveyResult } from './db-save-survey-result-protocols'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { mockSaveSurveyResultRepository } from '@/data/test'
import MockDate from 'mockdate'

interface SutTypes {
  sut: DbSaveSurveyResult
  dbSaveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const dbSaveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(dbSaveSurveyResultRepositoryStub)

  return {
    sut,
    dbSaveSurveyResultRepositoryStub
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

	test('Should throw if LoadSurveyByIdRepository throws', () => {
    const { sut, dbSaveSurveyResultRepositoryStub } = makeSut()
    jest
      .spyOn(dbSaveSurveyResultRepositoryStub, 'save')
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
