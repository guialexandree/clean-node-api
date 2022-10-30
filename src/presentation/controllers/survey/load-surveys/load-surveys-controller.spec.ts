import { LoadSurveys } from './load-surveys-controller-protocols'
import { LoadSurveysController } from './load-surveys.controller'
import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper'
import MockDate from 'mockdate'
import { InternalServerError } from '@/presentation/errors'
import { mockLoadSurveys } from '@/presentation/test'
import { mockSurveysModel } from '@/domain/test'

type SutTypes = {
	sut: LoadSurveysController
	loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
	const loadSurveysStub = mockLoadSurveys()
	const sut = new LoadSurveysController(loadSurveysStub)

	return {
		sut,
		loadSurveysStub
	}
}

describe('LoadSurveys Controller', () => {
	beforeAll(() => {
		MockDate.set(new Date())
	})

	afterAll(() => {
		MockDate.reset()
	})

	test('Should call LoadSurveys ', async () => {
		const { sut, loadSurveysStub } = makeSut()
		const loadSpy = jest.spyOn(loadSurveysStub, 'load')

		await sut.handle({})

		expect(loadSpy).toHaveBeenCalled()
	})

	test('Should returns 200 on success', async () => {
		const { sut } = makeSut()

		const httpReponse = await sut.handle({})

		expect(httpReponse).toEqual(ok(mockSurveysModel()))
	})

	test('Should returns 204 if loadSurveys returns empty', async () => {
		const { sut, loadSurveysStub } = makeSut()
		jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]))

		const httpReponse = await sut.handle({})

		expect(httpReponse).toEqual(noContent())
	})

	test('Should return status 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })

    const httpResponse = await sut.handle({})

    expect(httpResponse)
      .toEqual(serverError(new InternalServerError(httpResponse.body)))
  })
})
