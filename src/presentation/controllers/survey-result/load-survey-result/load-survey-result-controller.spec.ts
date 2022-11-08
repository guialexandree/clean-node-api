import { throwError } from '@/domain/test'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { mockLoadSurveyById } from '@/presentation/test'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { HttpRequest } from './load-survey-result-controller-protocols'

const mockRequest = (): HttpRequest => ({
	params: {
		surveyId: 'any_survey_id'
	}
})

type SutTypes = {
	sut: LoadSurveyResultController
	loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
	const loadSurveyByIdStub = mockLoadSurveyById()
	const sut = new LoadSurveyResultController(loadSurveyByIdStub)

	return {
		sut,
		loadSurveyByIdStub
	}
}

describe('LoadSurveyResult Controlller', () => {
	test('Should call LoadSurveyById with correct value', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
		const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
		const fakeRequest = mockRequest()

		await sut.handle(fakeRequest)

		expect(loadByIdSpy).toHaveBeenCalledWith(fakeRequest.params.surveyId)
	})

	test('Should returns 204 if LoadSurveyById returns null', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
		jest
			.spyOn(loadSurveyByIdStub, 'loadById')
			.mockReturnValueOnce(Promise.resolve(null))
		const fakeRequest = mockRequest()

		const httpResponse = await sut.handle(fakeRequest)

		expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
	})

	test('Should return 500 if LoadSurveyById throws', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
    jest
			.spyOn(loadSurveyByIdStub, 'loadById')
			.mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
