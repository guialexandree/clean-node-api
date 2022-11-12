import { LoadSurveysController } from './load-surveys.controller'
import { HttpRequest } from './load-surveys-controller-protocols'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { InternalServerError } from '@/presentation/errors'
import { LoadSurveysSpy } from '@/presentation/test'
import { throwError } from '@/domain/test'
import MockDate from 'mockdate'
import faker from 'faker'

const mockRequest = (): HttpRequest => {
	return {
		accountId: faker.datatype.uuid()
	}
}

type SutTypes = {
	sut: LoadSurveysController
	loadSurveysSpy: LoadSurveysSpy
}

const makeSut = (): SutTypes => {
	const loadSurveysSpy = new LoadSurveysSpy()
	const sut = new LoadSurveysController(loadSurveysSpy)

	return {
		sut,
		loadSurveysSpy
	}
}

describe('LoadSurveysController', () => {
	beforeAll(() => {
		MockDate.set(new Date())
	})

	afterAll(() => {
		MockDate.reset()
	})

	test('Should call LoadSurveys with correct accountId', async () => {
		const { sut, loadSurveysSpy } = makeSut()
		const httpRequest = mockRequest()

		await sut.handle(httpRequest)

		expect(loadSurveysSpy.accountId).toBe(httpRequest.accountId)
	})

	test('Should returns 200 on success', async () => {
		const { sut, loadSurveysSpy } = makeSut()

		const httpReponse = await sut.handle(mockRequest())

		expect(httpReponse).toEqual(ok(loadSurveysSpy.surveyModels))
	})

	test('Should returns 204 if loadSurveys returns empty', async () => {
		const { sut, loadSurveysSpy } = makeSut()
		loadSurveysSpy.surveyModels = []

		const httpReponse = await sut.handle(mockRequest())

		expect(httpReponse).toEqual(noContent())
	})

	test('Should return status 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    jest.spyOn(loadSurveysSpy, 'load').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse)
      .toEqual(serverError(new InternalServerError(httpResponse.body)))
  })
})
