import { LoadSurveyResult, LoadSurveyResultRepository } from './db-load-survey-result-protocols'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { mockLoadSurveyResultRepository } from '@/data/test'
import { throwError } from '@/domain/test'

type SutTypes = {
	sut: LoadSurveyResult
	loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
	const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
	const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)

	return {
		sut,
		loadSurveyResultRepositoryStub
	}
}

describe('DbLoadSurveyResult use case', () => {
	test('Should call LoadSurveyResultRepository with correct values', async () => {
		const { sut, loadSurveyResultRepositoryStub } = makeSut()
		const loadSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')

		await sut.load('any_survey_id')

		expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
	})

	test('Should throw if LoadSurveyByIdRepository throws', () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockImplementationOnce(throwError)

    const promise = sut.load('any_survey_id')

    void expect(promise).rejects.toThrow()
  })
})
