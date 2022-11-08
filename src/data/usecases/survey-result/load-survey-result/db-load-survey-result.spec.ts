import { LoadSurveyResult, LoadSurveyResultRepository, LoadSurveyByIdRepository } from './db-load-survey-result-protocols'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { mockLoadSurveyByIdRepository, mockLoadSurveyResultRepository } from '@/data/test'
import { mockSurveyResultModel, throwError } from '@/domain/test'

type SutTypes = {
	sut: LoadSurveyResult
	loadSurveyResultRepositoryStub: LoadSurveyResultRepository
	loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
	const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
	const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
	const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)

	return {
		sut,
		loadSurveyResultRepositoryStub,
		loadSurveyByIdRepositoryStub
	}
}

describe('DbLoadSurveyResult use case', () => {
	test('Should call LoadSurveyResultRepository with correct values', async () => {
		const { sut, loadSurveyResultRepositoryStub } = makeSut()
		const loadSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')

		await sut.load('any_survey_id')

		expect(loadSpy).toHaveBeenCalledWith('any_survey_id')
	})

	test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockImplementationOnce(throwError)

    const promise = sut.load('any_survey_id')

    void expect(promise).rejects.toThrow()
  })

	test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
		jest
			.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
			.mockReturnValueOnce(Promise.resolve(null))
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')

    await sut.load('any_survey_id')

    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

	test('Should return surveyResultModel on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.load('any_survey_id')

    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
