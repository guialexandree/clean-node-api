import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { mockSurveyResultModel, throwError } from '@/domain/test'
import { LoadSurveyById, HttpRequest } from './save-survey-resut-controller-protocols'
import { SaveSurveyResultController } from './save-survey-resut-controller'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InvalidParamError } from '@/presentation/errors'
import { mockSaveSurveyResult, mockLoadSurveyById } from '@/presentation/test'
import MockDate from 'mockdate'

const mockRequest = (): HttpRequest => ({
	params: {
		surveyId: 'any_survey_id'
	},
	body: {
		answer: 'any_answer'
	},
	accountId: 'any_account_id'
})

type SutTypes = {
	sut: SaveSurveyResultController
	loadSurveyByIdStub: LoadSurveyById
	saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
	const loadSurveyByIdStub = mockLoadSurveyById()
	const saveSurveyResultStub = mockSaveSurveyResult()
	const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)

	return {
		sut,
		loadSurveyByIdStub,
		saveSurveyResultStub
	}
}

describe('SaveSurveyResult Controller', () => {
	beforeAll(() => {
		MockDate.set(new Date())
	})

	afterAll(() => {
		MockDate.reset()
	})

	test('Should call LoadSurveyById with correct values', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
		const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')

		await sut.handle(mockRequest())

		expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
	})

	test('Should return 403 if LoadSurveyById returns null', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
		jest
			.spyOn(loadSurveyByIdStub, 'loadById')
			.mockReturnValueOnce(Promise.resolve(null))

		const httpResponse = await sut.handle(mockRequest())

		expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
	})

	test('Should throw if LoadSurveyById throws', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
    jest
			.spyOn(loadSurveyByIdStub, 'loadById')
			.mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

	test('Should return 403 if invalid answer is provided', async () => {
		const { sut } = makeSut()
		const fakeRequest = mockRequest()
		fakeRequest.body.answer = 'invalid_answer'

		const httpResponse = await sut.handle(fakeRequest)

		expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
	})

	test('Should call SaveSurveyResult with correct values', async () => {
		const { sut, saveSurveyResultStub } = makeSut()
		const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')

		await sut.handle(mockRequest())

		expect(saveSpy).toHaveBeenCalledWith({
			surveyId: 'any_survey_id',
			accountId: 'any_account_id',
			answer: 'any_answer',
			date: new Date()
		})
	})

	test('Should throw if SaveSurveyResult throws', async () => {
		const { sut, saveSurveyResultStub } = makeSut()
    jest
			.spyOn(saveSurveyResultStub, 'save')
			.mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

	test('Should return 200 on success', async () => {
		const { sut } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})
