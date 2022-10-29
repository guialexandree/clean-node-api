import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { SaveSurveyResultController } from './save-survey-resut-controller'
import { LoadSurveyById, SurveyModel, HttpRequest } from './save-survey-resut-controller-protocols'

const makeFakeRequest = (): HttpRequest => ({
	params: {
		surveyId: 'any_survey_id'
	}
})

const makeLoadSurveyById = (): LoadSurveyById => {
	class LoadSurveyByIdStub implements LoadSurveyById {
		async loadById (id: string): Promise<SurveyModel> {
			return await new Promise(resolve => resolve(makeFakeSurvey()))
		}
	}

	return new LoadSurveyByIdStub()
}

const makeFakeSurvey = (): SurveyModel => {
	return {
		id: 'any_id',
		question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }, {
        answer: 'other_answer'
      }
    ],
		date: new Date()
	}
}

type SutTypes = {
	sut: SaveSurveyResultController
	loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
	const loadSurveyByIdStub = makeLoadSurveyById()
	const sut = new SaveSurveyResultController(loadSurveyByIdStub)

	return {
		sut,
		loadSurveyByIdStub
	}
}

describe('SaveSurveyResult Controller', () => {
	test('Should call LoadSurveyById with correct values', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
		const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')

		await sut.handle(makeFakeRequest())

		expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
	})

	test('Should return 403 if LoadSurveyById returns null', async () => {
		const { sut, loadSurveyByIdStub } = makeSut()
		jest
			.spyOn(loadSurveyByIdStub, 'loadById')
			.mockReturnValueOnce(new Promise(resolve => resolve(null)))

		const httpResponse = await sut.handle(makeFakeRequest())

		expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
	})

	test('Should throw if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
