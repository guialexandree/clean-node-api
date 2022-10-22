import { SurveyResultModel, SaveSurveyResultModel, DbSaveSurveyResult } from './db-save-survey-result-protocols'
import MockDate from 'mockdate'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repository'

const makeFakeSaveSurveyResultData = (): SaveSurveyResultModel => {
  return {
    accountId: 'any_account_id',
		surveyId: 'any_survey_id',
		answer: 'any_answer',
		date: new Date()
  }
}

const makeFakeSaveSurveyResult = (): SurveyResultModel =>
  Object.assign({}, makeFakeSaveSurveyResultData(), {
    id: 'any_id'
  })

const makeDbSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class DbSaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await new Promise(resolve => resolve(makeFakeSaveSurveyResult()))
    }
  }
  return new DbSaveSurveyResultRepositoryStub()
}

interface SutTypes {
  sut: DbSaveSurveyResult
  dbSaveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const dbSaveSurveyResultRepositoryStub = makeDbSaveSurveyResultRepository()
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

    await sut.save(makeFakeSaveSurveyResult())

    expect(saveSpy).toHaveBeenCalledWith(makeFakeSaveSurveyResult())
  })
})
