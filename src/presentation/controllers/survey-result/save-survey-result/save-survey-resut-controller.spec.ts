import { HttpRequest } from './save-survey-resut-controller-protocols'
import { SaveSurveyResultController } from './save-survey-resut-controller'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { SaveSurveyResultSpy, LoadSurveyByIdSpy } from '@/presentation/test'
import { InvalidParamError } from '@/presentation/errors'
import { throwError } from '@/domain/test'
import MockDate from 'mockdate'
import faker from 'faker'

const mockRequest = (answer: string = null): HttpRequest => ({
	params: {
		surveyId: faker.datatype.uuid()
	},
	body: {
		answer
	},
	accountId: faker.datatype.uuid()
})

type SutTypes = {
	sut: SaveSurveyResultController
	loadSurveyByIdSpy: LoadSurveyByIdSpy
	saveSurveyResultSpy: SaveSurveyResultSpy
}

const makeSut = (): SutTypes => {
	const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
	const saveSurveyResultSpy = new SaveSurveyResultSpy()
	const sut = new SaveSurveyResultController(loadSurveyByIdSpy, saveSurveyResultSpy)

	return {
		sut,
		loadSurveyByIdSpy,
		saveSurveyResultSpy
	}
}

describe('SaveSurveyResultController', () => {
	beforeAll(() => {
		MockDate.set(new Date())
	})

	afterAll(() => {
		MockDate.reset()
	})

	test('Should call LoadSurveyById with correct values', async () => {
		const { sut, loadSurveyByIdSpy } = makeSut()
		const httpRequest = mockRequest()

		await sut.handle(httpRequest)

		expect(loadSurveyByIdSpy.id).toBe(httpRequest.params.surveyId)
	})

	test('Should return 403 if LoadSurveyById returns null', async () => {
		const { sut, loadSurveyByIdSpy } = makeSut()
		loadSurveyByIdSpy.surveyModel = null

		const httpResponse = await sut.handle(mockRequest())

		expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
	})

	test('Should return 500 if LoadSurveyById throws', async () => {
		const { sut, loadSurveyByIdSpy } = makeSut()
    jest
			.spyOn(loadSurveyByIdSpy, 'loadById')
			.mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

	test('Should return 403 if invalid answer is provided', async () => {
		const { sut } = makeSut()

		const httpResponse = await sut.handle(mockRequest('invalid_answer'))

		expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
	})

	test('Should call SaveSurveyResult with correct values', async () => {
		const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut()
		const httpRequest = mockRequest(loadSurveyByIdSpy.surveyModel.answers[0].answer)

		await sut.handle(httpRequest)

		expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
			surveyId: httpRequest.params.surveyId,
      accountId: httpRequest.accountId,
			answer: httpRequest.body.answer,
			date: new Date()
		})
	})

	test('Should return 500 if SaveSurveyResult throws', async () => {
		const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut()
    jest
			.spyOn(saveSurveyResultSpy, 'save')
			.mockImplementationOnce(throwError)
    const httpRequest = mockRequest(loadSurveyByIdSpy.surveyModel.answers[0].answer)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

	test('Should return 200 on success', async () => {
		const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut()
    const httpRequest = mockRequest(loadSurveyByIdSpy.surveyModel.answers[0].answer)

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse).toEqual(ok(saveSurveyResultSpy.surveyResultModel))
  })
})
